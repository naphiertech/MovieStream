import { NextResponse } from 'next/server';

function resolveUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch (e) {
    return url;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const headersString = searchParams.get('headers');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Parse custom headers passed from the resolver
  let customHeaders: Record<string, string> = {};
  if (headersString) {
    try {
      customHeaders = JSON.parse(decodeURIComponent(headersString));
    } catch (e) {
      console.warn('[Proxy API] Failed to parse custom headers:', e);
    }
  }

  // Build headers for the outbound request
  const outboundHeaders = new Headers();
  
  // Set default modern User-Agent
  outboundHeaders.set(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // Set referer and origin if supplied by the stream metadata
  if (customHeaders.referer || customHeaders.Referer) {
    outboundHeaders.set('Referer', customHeaders.referer || customHeaders.Referer);
  }
  if (customHeaders.origin || customHeaders.Origin) {
    outboundHeaders.set('Origin', customHeaders.origin || customHeaders.Origin);
  }

  // Forward ranges for seeking within direct files (e.g. mp4)
  const clientRange = request.headers.get('range');
  if (clientRange) {
    outboundHeaders.set('range', clientRange);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: outboundHeaders,
      method: 'GET',
    });

    const contentType = response.headers.get('content-type') || '';
    const isPlaylist =
      targetUrl.includes('.m3u8') ||
      contentType.includes('mpegurl') ||
      contentType.includes('mpegURL') ||
      contentType.includes('application/x-mpegURL');

    // If it's an HLS playlist, rewrite internal URLs to pass back through the proxy
    if (isPlaylist) {
      const playlistText = await response.text();
      const lines = playlistText.split('\n');

      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Rewrite tags containing URI (e.g. decryption keys, subtitles)
        if (trimmed.startsWith('#')) {
          return line.replace(/URI="([^"]+)"/g, (match, p1) => {
            const resolved = resolveUrl(p1, targetUrl);
            const headersParam = headersString ? `&headers=${headersString}` : '';
            return `URI="/api/proxy?url=${encodeURIComponent(resolved)}${headersParam}"`;
          });
        }

        // Rewrite absolute and relative stream/segment URLs
        const resolved = resolveUrl(trimmed, targetUrl);
        const headersParam = headersString ? `&headers=${headersString}` : '';
        return `/api/proxy?url=${encodeURIComponent(resolved)}${headersParam}`;
      });

      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl');
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Cache-Control', 'no-cache');

      return new NextResponse(rewrittenLines.join('\n'), {
        headers: responseHeaders,
        status: 200,
      });
    }

    // Otherwise, stream binary data (e.g. .ts segments, mp4 chunks) directly
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    // Copy relevant headers from the target response
    ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control'].forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // Use ReadableStream to pipeline bytes directly to the client without buffering in memory
    return new NextResponse(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error: any) {
    console.error(`[Proxy API] Failed proxying URL ${targetUrl}:`, error);
    return new NextResponse(`Proxy error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
}
