import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/calculate-mean-median-mode-from-array-of-objects/",
    plugins: [react()],
});
