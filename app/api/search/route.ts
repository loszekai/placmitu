import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const externalDomain = process.env.API_URL;
  const apiToken = process.env.API_TOKEN;
  
  if (!externalDomain || !apiToken) {
    return NextResponse.json(
      { error: "API_URL or API_TOKEN environment variables are not configured" },
      { status: 500 }
    );
  }
  // The user says "call /api/search endpoint. This will pass my request to external API"
  // "Cut /api from path, since API expect url without /api prefix"
  // Since this route handles /api/search, request.nextUrl.pathname is /api/search
  // We strip the /api part, resulting in /search, and append domain.
  const targetPath = request.nextUrl.pathname.replace(/^\/api/, "");
  const targetUrl = `${externalDomain}${targetPath}`;

  try {
    const body = await request.text();
    const response = await fetch(targetUrl, {
      method: "POST",
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
