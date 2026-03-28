import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts({ rollupTypes: true, bundledPackages: ["*"] })],
    build: {
        outDir: "build",
        lib: {
            entry: "src/index.ts",
            name: "twodo",
            fileName: "twodo",
            formats: ["es"],
        },
    },
});
