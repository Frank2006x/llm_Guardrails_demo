/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // Exclude ChromaDB packages from server components processing
  serverExternalPackages: [
    "chromadb",
    "@chroma-core/default-embed",
    "@chroma-core/ai-embeddings-common",
  ],

  // Empty Turbopack config to silence warnings
  turbopack: {},

  // Webpack configuration to handle problematic files
  webpack: (config, { isServer, dev }) => {
    // Only process ChromaDB on the server side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Exclude problematic files from compilation
    config.module.rules.push({
      test: /\.test\.(ts|tsx|js|jsx)$/,
      use: "null-loader",
    });

    config.module.rules.push({
      test: /README\.md$/,
      use: "null-loader",
    });

    config.module.rules.push({
      test: /\.(mts|cts)$/,
      use: "null-loader",
    });

    return config;
  },
};

export default nextConfig;
