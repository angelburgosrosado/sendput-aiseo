import { NextResponse } from "next/server";
import { providerRegistry, ProviderId } from "@/lib/adapters";

export async function GET() {
  const statuses = Object.keys(providerRegistry).map((key) => {
    const adapter = providerRegistry[key as ProviderId];
    return {
      provider: key,
      name: adapter.name,
      description: adapter.description,
      requiresOAuth: adapter.requiresOAuth,
      connected: true,
      lastSync: new Date().toISOString(),
    };
  });

  return NextResponse.json({ success: true, providers: statuses });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerId = body.provider as ProviderId;
    const adapter = providerRegistry[providerId];
    if (!adapter) {
      return NextResponse.json({ success: false, error: "Unknown provider" }, { status: 400 });
    }
    const result = await adapter.testConnection(body.credentials || {});
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
