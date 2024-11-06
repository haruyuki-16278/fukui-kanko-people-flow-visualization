import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES ? "/hokuriku-inbound-kanko-visualization" : "",
};

export default nextConfig;
