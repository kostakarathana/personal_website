const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/') {
            url.pathname = '/index.html';
        }

        const assetRequest = new Request(url.toString(), request);
        const assetResponse = await env.ASSETS.fetch(assetRequest);
        const headers = new Headers(assetResponse.headers);

        Object.entries(securityHeaders).forEach(([key, value]) => {
            headers.set(key, value);
        });

        return new Response(assetResponse.body, {
            status: assetResponse.status,
            statusText: assetResponse.statusText,
            headers
        });
    }
};
