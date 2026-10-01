// Tiny, deliberately-limited markdown-lite parser for BlogPost.body.
//
// The body field has always been plain text (a textarea in the admin, split
// on blank lines into paragraphs — see BlogPostForm/BlogPostView history).
// This adds three conventions on top, chosen so every EXISTING post with
// none of this syntax still renders exactly as before:
//
//   ## Heading text        -> a real <h2> section break
//   ### Question text?     -> a Q&A block: the question, then the paragraph(s)
//                             that follow (until the next heading) are its
//                             answer. Rendered distinctly AND collected so the
//                             page can emit FAQPage JSON-LD from real content
//                             instead of hand-duplicating it.
//   [label](/path)          -> an inline link inside a paragraph
//
// This exists because flat, unheaded prose gives search engines and AI
// answer engines nothing to extract a direct answer from — see the Journal
// SEO/AEO/AIO pass this was written for.

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "qa"; question: string; answer: string };

export function parseBlogBody(body: string): BlogBlock[] {
  const rawParagraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks: BlogBlock[] = [];
  let i = 0;
  while (i < rawParagraphs.length) {
    const para = rawParagraphs[i];

    const h2 = para.match(/^##\s+(.+)$/);
    if (h2) {
      blocks.push({ type: "h2", text: h2[1].trim() });
      i++;
      continue;
    }

    const q = para.match(/^###\s+(.+)$/);
    if (q) {
      // Answer = every following paragraph until the next heading (## / ###)
      // or end of body, joined with a blank line (BlogAnswer renders each
      // on its own line; faqJsonLd gets the plain joined text).
      const answerParas: string[] = [];
      let j = i + 1;
      while (j < rawParagraphs.length && !/^#{2,3}\s+/.test(rawParagraphs[j])) {
        answerParas.push(stripInlineLinks(rawParagraphs[j]));
        j++;
      }
      blocks.push({ type: "qa", question: q[1].trim(), answer: answerParas.join("\n\n") });
      i = j;
      continue;
    }

    blocks.push({ type: "p", text: para });
    i++;
  }
  return blocks;
}

export function extractFaqs(blocks: BlogBlock[]): { question: string; answer: string }[] {
  return blocks
    .filter((b): b is Extract<BlogBlock, { type: "qa" }> => b.type === "qa")
    .map((b) => ({ question: b.question, answer: b.answer }));
}

// Plain-text version of a paragraph for JSON-LD (no [label](url) markup).
function stripInlineLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

// Split a paragraph into plain-text and link segments for rendering, e.g.
// "See the [care guide](/blog/how-to-care-for-laser-cut-linen) for more."
export type InlineSegment = { text: string; href?: string };

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index) });
    segments.push({ text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments.length ? segments : [{ text }];
}
