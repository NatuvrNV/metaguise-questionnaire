import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

// Rewrites Lovable `*.asset.json` imports so the parsed JSON's `url` field
// points at the absolute Lovable CDN URL. This lets the built `dist` load
// the original assets from anywhere (Apache, Nginx, static hosts).
const ASSET_CDN_ORIGIN = "https://metaguise-facade-spark.lovable.app";

function lovableAssetJson(): Plugin {
  const SUFFIX = "?lovable-asset";
  return {
    name: "lovable-asset-json",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(".asset.json")) return null;
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (!resolved) return null;
      return resolved.id + SUFFIX;
    },
    load(id) {
      if (!id.endsWith(".asset.json" + SUFFIX)) return null;
      const filePath = id.slice(0, -SUFFIX.length);
      const raw = JSON.parse(readFileSync(filePath, "utf8"));
      if (typeof raw.url === "string" && raw.url.startsWith("/")) {
        raw.url = ASSET_CDN_ORIGIN + raw.url;
      }
      return `export default ${JSON.stringify(raw)};`;
    },
  };
}

export default defineConfig({
  plugins: [lovableAssetJson(), react(), tsconfigPaths(), tailwindcss()],
  server: {
    host: "::",
    port: 8080,
  },
});
