/**
 * cloudflare-worker/sendput-edge-worker.js
 * Server-Side HTMLRewriter Edge Worker for SendPut EPO Engine
 * Injects LocalBusiness JSON-LD & Multi-Protocol Link headers before non-JS AI crawlers parse HTML.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const tenantSlug = env.SENDPUT_TENANT_SLUG || "myiad-insurance-ai";
    const sendputHost = env.SENDPUT_HOST || "https://sendput.com";

    if (url.pathname === "/llms.txt") {
      return fetch(`${sendputHost}/v1/tenants/${tenantSlug}/llms.txt`);
    }

    const response = await fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const newHeaders = new Headers(response.headers);
    newHeaders.append("Link", `<${sendputHost}/v1/tenants/${tenantSlug}/llms.txt>; rel="llms-txt"`);
    newHeaders.append("Link", `<${sendputHost}/mcp/${tenantSlug}/sse>; rel="mcp-server"`);

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(
            `<script src="${sendputHost}/epo-edge.js?tenant=${tenantSlug}" defer></script>` +
            `<link rel="llms-txt" type="text/markdown" href="${sendputHost}/v1/tenants/${tenantSlug}/llms.txt" />` +
            `<link rel="mcp-server" type="application/json" href="${sendputHost}/mcp/${tenantSlug}/sse" />`,
            { html: true }
          );
        }
      })
      .transform(new Response(response.body, { status: response.status, headers: newHeaders }));
  }
};
