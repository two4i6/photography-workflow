/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['luoboimg.s3.us-east-2.amazonaws.com'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        outputStandalone: true,
    },
}

module.exports = nextConfig