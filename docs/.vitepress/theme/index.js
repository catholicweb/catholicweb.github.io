import Layout from "./Layout.vue"; // Your custom layout
import "./style.css";

export default {
  Layout, // <-- Custom theme, no VitePress defaults
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  },
};
