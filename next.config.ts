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
               },
               {
                    protocol: 'https',
                    hostname: 'zbcld3vq1ntclyw4.public.blob.vercel-storage.com',
                    pathname: '**'
               },
               {
                    protocol: 'https',
                    hostname: 'cdn.oktaa.my.id',
                    pathname: '**'
               },
               {
                    protocol: 'https',
                    hostname: 'i.ibb.co',
                    pathname: '**'
               },
               {
                    protocol: 'https',
                    hostname: 'i.imgur.com',
                    pathname: '**'
               },
               {
                    protocol: 'https',
                    hostname: 'cdn2.oktaa.my.id',
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