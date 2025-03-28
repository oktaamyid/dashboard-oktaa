import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'placehold.co',
                    pathname: '**'
               },
               {
                    protocol: "https",
                    hostname: 'i.ibb.co.com',
                    pathname: '**'
               }
          ],
          dangerouslyAllowSVG: true,
     },
     experimental: {
          middlewarePrefetch: "strict",
     },
};

export default nextConfig;
