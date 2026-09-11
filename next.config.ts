import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS in `out/`, served as static assets by a Cloudflare
  // Worker (see wrangler.jsonc). Everything is rendered at build time.
  output: "export",
};

export default withNextIntl(nextConfig);
