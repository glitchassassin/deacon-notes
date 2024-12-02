import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  // Add base URL for GitHub Pages (replace 'repo-name' with your actual repository name)
  basename: "/deacon-notes",
} satisfies Config;
