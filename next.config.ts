import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
      {
        // ImageKit delivery domain for vehicle photos — see src/lib/imagekit.ts.
        // Scoped to our account id (from NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT); update
        // if the ImageKit account/endpoint ever changes.
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/brgzgc3ln/**",
      },
    ],
  },
};

export default nextConfig;
