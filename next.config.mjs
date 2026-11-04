/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" }, // Boleh dihapus kalau mau
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }, // Wajib untuk Vercel Blob
    ],
  },
};
export default nextConfig;