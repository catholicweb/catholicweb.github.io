import Layout from './Layout.vue'  // Your custom layout
//import './typography.css'
import './style.css'

export default {
  Layout,  // <-- Custom theme, no VitePress defaults
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}