import { NextRequest, NextResponse } from "next/server";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const externalDomain = process.env.API_URL;
  const apiToken = process.env.API_TOKEN;

  if (!externalDomain || !apiToken) {
    return NextResponse.json(
      { error: "API_URL or API_TOKEN environment variables are not configured" },
      { status: 500 }
    );
  }

  const { path } = await params;
  // Reconstruct the path and forward to the external API (without the /api prefix)
  const targetUrl = `${externalDomain}/${path.join("/")}${request.nextUrl.search}`;

  try {
    const body = await request.text();
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": request.headers.get("content-type") || "application/json",
        "Authorization": `Bearer ${apiToken}`,
      },
      body: body || undefined,
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const data = await response.text();
      return new NextResponse(data, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
