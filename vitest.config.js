import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,       // allows describe, it, expect globally
    environment: "node", // node environment
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
