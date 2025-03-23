import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'placehold.co',
                    pathname: '**'
               },
          ],
          dangerouslyAllowSVG: true,
     },
     experimental: {
          middlewarePrefetch: "strict",
     },
};

export default nextConfig;
