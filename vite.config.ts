import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    // Output client assets to dist/client
    outDir: 'dist/client',
    // Ensure sourcemaps are generated for debugging (optional but recommended)
    sourcemap: true,
  },
  plugins: [
    remix({
      // Explicitly set the server build directory
      serverBuildDirectory: "dist/server",
      // Specify the server build entry point path
      serverBuildPath: "dist/server/index.js",
      // Enable future flags
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        // Add other flags mentioned in warnings if necessary
        // v3_lazyRouteDiscovery: true, // Optional: Enable if needed later
        // v3_singleFetch: true,       // Optional: Enable if needed later
      },
    }),
    tsconfigPaths(),
  ],
});
