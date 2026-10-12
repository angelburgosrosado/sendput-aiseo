import { NextResponse } from "next/server";
import { demoKeywords } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const intent = searchParams.get("intent");
  const projectId = searchParams.get("projectId");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  let result = [...demoKeywords];

  if (projectId) {
    result = result.filter((k) => k.projectId === projectId);
  }
  if (intent && intent !== "ALL") {
    result = result.filter((k) => k.intent === intent);
  }
  if (search) {
    result = result.filter((k) => k.term.toLowerCase().includes(search));
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    data: result.slice(0, limit),
    isSynthetic: true,
  });
}
