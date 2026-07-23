import { NextResponse } from "next/server";
import { fetchInstagramFeed } from "@/lib/integrations";
export async function GET() { return NextResponse.json(await fetchInstagramFeed(8)); }
