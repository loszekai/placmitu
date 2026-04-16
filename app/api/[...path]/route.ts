import { NextRequest, NextResponse } from "next/server";

async function proxy(request: NextRequest) {
  const externalDomain = process.env.API_URL;
  const apiToken = process.env.API_TOKEN;

  if (!externalDomain || !apiToken) {
    return NextResponse.json(
      { error: "API_URL or API_TOKEN environment variables are not configured" },
      { status: 500 }
    );
  }

  const targetPath = request.nextUrl.pathname.replace(/^\/api/, '');
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : "";
  const targetUrl = `${externalDomain}${targetPath}${queryString}`;

  try {
    const hasBody = !["GET", "HEAD"].includes(request.method);
    let bodyInit: ArrayBuffer | undefined;
    if (hasBody) {
      const buf = await request.arrayBuffer();
      if (buf.byteLength > 0) {
        bodyInit = buf;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Proxy] ${request.method} ${targetUrl}`);
    }

    const authToken = request.cookies.get("authToken")?.value;
    const incomingContentType = request.headers.get("content-type");
    const fetchHeaders: Record<string, string> = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Bearer ${apiToken}`,
    };
    if (incomingContentType) {
      fetchHeaders["Content-Type"] = incomingContentType;
    } else if (bodyInit !== undefined) {
      fetchHeaders["Content-Type"] = "application/json";
    }

    if (authToken) {
      fetchHeaders["x-auth-token"] = authToken;
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: fetchHeaders,
      body: bodyInit,
    });

    const contentType = response.headers.get("content-type");
    const responseHeaders = new Headers();
    const tokenHeader = response.headers.get("x-auth-token");

    let nextResponse: NextResponse;

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok && process.env.NODE_ENV === 'development') {
        console.error(`[API Proxy] Upstream error: ${response.status}`, data);
      }
      nextResponse = NextResponse.json(data, { status: response.status, headers: responseHeaders });
    } else {
      const data = await response.text();
      if (!response.ok && process.env.NODE_ENV === 'development') {
        console.error(`[API Proxy] Upstream error: ${response.status}`, data);
      }
      responseHeaders.set("Content-Type", contentType || "text/plain");
      nextResponse = new NextResponse(data, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    if (tokenHeader) {
      nextResponse.cookies.set("authToken", tokenHeader, {
        path: "/",
        maxAge: 3600,
        sameSite: 'lax'
      });
    }

    return nextResponse;
  } catch (error) {
    console.error(`[API Proxy] Exception during ${request.method} to ${targetUrl}:`, error);
    return NextResponse.json(
        { error: "Failed to fetch from external API" },
        { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
