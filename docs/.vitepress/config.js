import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import { renderMarkdownFields, generateRewrites, generateNav } from "./generateConfig.js";

export default defineConfig(async () => ({
  title: "¿Quién soy?",
  cleanUrls: true,
  // rewrites: generateRewrites("./docs"),
  description: "Vocaciones Navarra",
  languages: [
    { code: 'es', label: 'Español', path: '/' },
    { code: 'en', label: 'English', path: 'en/' },
    { code: 'eus', label: 'Euskara', path: 'eus/' }
  ],
  themes: [
    { id: 'default', name: 'Blue Sharp', icon: '🔷', description: 'Clean and professional' },
    { id: 'forest', name: 'Forest Green', icon: '🌲', description: 'Natural and calm' },
    { id: 'sunset', name: 'Sunset Orange', icon: '🌅', description: 'Warm and vibrant' },
    { id: 'purple', name: 'Royal Purple', icon: '👑', description: 'Elegant and bold' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', description: 'Neon and futuristic' }
  ],
  themeConfig: {
    nav: await generateNav()
  },
  transformHead: ({ pageData }) => [
    ['meta', { name: 'keywords', content: 'navarra, vocaciones, seminario, vida consagrada' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: pageData.title || '¿Quién soy?' }],
    ['meta', { property: 'og:description', content: pageData.subtitle || 'Vocaciones Navarra' }],
    ['meta', { property: 'og:image', content: pageData.image || '' }],
    ['meta', { name: 'twitter:card', content: pageData.image || '' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:description', content: pageData.description || 'Vocaciones Navarra' }]
  ],
  plugins: [tailwindcss()],
  transformPageData(pageData) {
    const fm = pageData.frontmatter;
    if (fm) renderMarkdownFields(fm);
    return pageData;
  },
}));
