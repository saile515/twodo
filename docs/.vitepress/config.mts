import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Twodo",
    description: "A minimal data-oriented 2D WebGL engine.",
    vite: { build: { outDir: ".vitepress/build" } },
    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "API", link: "/api" },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/saile515/twodo" },
        ],
    },
});
