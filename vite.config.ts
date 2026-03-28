import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        outDir: "build",
        lib: {
            entry: "src/index.ts",
            name: "twodo",
            fileName: (format) => `twodo.${format}.js`,
        },
    },
});
