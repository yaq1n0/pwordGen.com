import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom/vitest"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**/*.{js,ts,vue}"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.test.{js,ts}",
        "**/*.spec.{js,ts}",
        "**/vite-env.d.ts",
        "**/main.ts"
      ],
      reportsDirectory: "./coverage",
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
