import type { CapacitorConfig } from "@capacitor/cli";

// The Android app loads the published web app, so lessons, progress and AI stay in sync.
const config: CapacitorConfig = {
  appId: "app.lovable.bibleenmain",
  appName: "Bible en Main",
  webDir: "public",
  server: {
    url: "https://journey-to-faith-guide.lovable.app",
    cleartext: false,
  },
  android: { backgroundColor: "#0F1A2E" },
};

export default config;
