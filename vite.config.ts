import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "jon-winsley",
      project: "deacon-notes",
      disable: !process.env.SENTRY_AUTH_TOKEN,
    }),
    tailwindcss(),
  ],

  build: {
    sourcemap: true,
  },
});
