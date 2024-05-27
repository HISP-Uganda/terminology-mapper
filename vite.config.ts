import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { presetUno, presetAttributify } from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        UnoCSS({
            presets: [presetAttributify({}), presetUno()],
        }),
    ],
});
