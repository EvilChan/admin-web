import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProxyOptions, defineConfig, loadEnv } from "vite";
import Pages from "vite-plugin-pages";
import react from "@vitejs/plugin-react-swc";
import AutoImport from "unplugin-auto-import/vite";

const __dirname = fileURLToPath(path.dirname(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, __dirname);
    const apiProxy: Record<string, ProxyOptions> | undefined =
        env.VITE_API_USE_PROXY === "true"
            ? {
                  "/api": {
                      target: env.VITE_API_HOST,
                      changeOrigin: true,
                  },
              }
            : void 0;

    return {
        base: env.VITE_BASE_URL,
        server: {
            host: "0.0.0.0",
            proxy: {
                ...apiProxy,
            },
        },
        preview: {
            host: "0.0.0.0",
            proxy: {
                ...apiProxy,
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        plugins: [
            react(),
            AutoImport({
                imports: ["react", "react-router-dom", "ahooks"],
                dts: "./src/auto-imports.d.ts",
            }),
            Pages({
                dirs: [
                    {
                        dir: "src/pages",
                        baseRoute: "",
                        filePattern: "**/*.tsx",
                    },
                ],
                exclude: ["**/components/*.tsx", "NotFound/index.tsx", "user/login/index.tsx"],
                extendRoute(route, parent) {
                    if (route.element) {
                        const realPath = path.join(__dirname, route.element, "../meta.json");
                        if (fs.existsSync(realPath)) {
                            const metaContent = fs.readFileSync(path.join(__dirname, route.element, "../meta.json"), {
                                encoding: "utf-8",
                            });
                            const meta = JSON.parse(metaContent);
                            parent.handle = meta;
                        }
                    }

                    return route;
                },
            }),
        ],
        build: {
            rollupOptions: {
                output: {
                    chunkFileNames: "js/[name]-[hash].js",
                    entryFileNames: "js/[name]-[hash].js",
                    assetFileNames: (chunkInfo) => {
                        if (chunkInfo.name?.endsWith(".css")) {
                            return "css/[name]-[hash].css";
                        }
                        const imgExts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ",ico"];
                        if (imgExts.some((ext) => chunkInfo.name?.endsWith(ext))) {
                            return "imgs/[name]-[hash].[ext]";
                        }
                        return "assets/[name]-[hash].[ext]";
                    },
                    manualChunks: (id) => {
                        if (id.includes("node_modules")) {
                            const name = id.split("node_modules/")[1].split("/");
                            if (name[0] === ".pnpm") {
                                return name[1];
                            } else {
                                return name[0];
                            }
                        }
                    },
                },
            },
        },
    };
});
