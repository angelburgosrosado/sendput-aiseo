import { NextResponse } from "next/server";
import { demoProjects } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");

  if (orgId) {
    const filtered = demoProjects.filter((p) => p.orgId === orgId);
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({ success: true, data: demoProjects });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProj = {
      id: `proj_${Date.now()}`,
      orgId: body.orgId || "org_apex",
      name: body.name,
      domain: body.domain,
      description: body.description || "",
      targetCountry: body.targetCountry || "US",
      status: "ACTIVE" as const,
      sfaiScore: 65.0,
      discoveryVelocity: 12.0,
      healthQuotient: 90.0,
      aiCitationShare: 20.0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    return NextResponse.json({ success: true, data: newProj });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
