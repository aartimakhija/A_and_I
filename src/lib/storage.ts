// S3-compatible object storage (works with AWS S3, Cloudflare R2, Backblaze B2,
// DigitalOcean Spaces, MinIO, etc — anything that speaks the S3 API).
//
// Configure via env (see .env.example):
//   S3_ENDPOINT        e.g. https://<accountid>.r2.cloudflarestorage.com  (omit for real AWS)
//   S3_REGION          e.g. auto | ap-south-1
//   S3_BUCKET          e.g. aandi-catalogue
//   S3_ACCESS_KEY_ID
//   S3_SECRET_ACCESS_KEY
//   S3_PUBLIC_URL_BASE e.g. https://images.aandi.com  (CDN/public bucket URL used to build ProductImage.url)
//
// Until those are set this module fails soft in dev by writing to /public/uploads
// instead, so the rest of the app (which only ever deals with a public `url` string)
// doesn't need to know which backend is active.
//
// IMPORTANT — this fallback is dev-only. Vercel (and most serverless hosts) deploy
// the app onto a read-only filesystem outside of /tmp: a write to /public/uploads
// from a running production function will fail outright (or, on hosts that do allow
// it, land in a scratch area that's wiped on the next deploy/instance and never
// shared with other instances). The 39 product images live on the site today are
// static files that were committed to the repo by a one-off migration script, not
// written by this fallback while deployed — so if S3_* isn't set in production, the
// admin/vendor "upload image" button is silently broken there even though the
// existing catalogue looks fine. See the guard below.

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const configured = !!(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);

let S3Client: any, PutObjectCommand: any;
async function loadSdk() {
  if (S3Client) return;
  // Lazy import so the package is only required when S3 is actually configured —
  // keeps local/dev usage (writing to /public/uploads) free of the dependency.
  const mod = await import("@aws-sdk/client-s3");
  S3Client = mod.S3Client;
  PutObjectCommand = mod.PutObjectCommand;
}

function client() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.S3_ENDPOINT, // needed for R2/MinIO/most non-AWS endpoints
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

function publicUrl(key: string) {
  const base = process.env.S3_PUBLIC_URL_BASE;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  // AWS default virtual-hosted-style URL
  return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

export type UploadResult = { url: string; key: string };

/** Upload a raw buffer (e.g. from a multipart form) and return its public URL. */
export async function uploadImageBuffer(buffer: Buffer, opts: { filename: string; contentType: string; folder?: string }): Promise<UploadResult> {
  const key = `${opts.folder || "products"}/${Date.now()}-${slug(opts.filename)}`;

  if (configured) {
    await loadSdk();
    await client().send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: opts.contentType,
      ACL: "public-read",
    }));
    return { url: publicUrl(key), key };
  }

  // Vercel sets this env var in every deployment (and only there) — if we're running
  // on Vercel with no S3 configured, don't even attempt the /public/uploads write:
  // it will fail (read-only fs) or silently not persist, and either way the caller
  // deserves a clear reason rather than a raw filesystem error.
  if (process.env.VERCEL) {
    throw new Error(
      "Image storage isn't configured for this deployment yet — uploads can't be saved here. " +
      "Set S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY (a real AWS S3 bucket, or an " +
      "S3-compatible one like Cloudflare R2 with S3_ENDPOINT + S3_PUBLIC_URL_BASE) in the " +
      "project's environment variables, then redeploy."
    );
  }

  // Dev fallback: write into /public/uploads so `url` still resolves locally.
  const dir = path.join(process.cwd(), "public", "uploads", opts.folder || "products");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, path.basename(key));
  await writeFile(filePath, buffer);
  return { url: `/uploads/${opts.folder || "products"}/${path.basename(key)}`, key };
}

/** Migration helper: upload a base64 data-URL (as used by the legacy DL/IMG catalogue) and return its public URL. */
export async function uploadImageFromDataUrl(dataUrl: string, opts: { filename: string; folder?: string }): Promise<UploadResult> {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error("Not a base64 data URL");
  const [, contentType, b64] = match;
  const buffer = Buffer.from(b64, "base64");
  return uploadImageBuffer(buffer, { filename: opts.filename, contentType, folder: opts.folder });
}

function slug(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
}

export const storageBackend = configured ? "s3" : "local (/public/uploads — set S3_* env vars for production)";
