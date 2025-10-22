import { defineConfig } from 'vitepress'

import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

/** Recursively render all `text` fields in an object */
function renderMarkdownFields(obj) {
  if (!obj || typeof obj !== 'object') return
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (key === 'description' && typeof value === 'string') {
      obj[key + 'Html'] = md.render(value) // e.g. textHtml
    } else if (typeof value === 'object') {
      renderMarkdownFields(value)
    }
  }
}

export default defineConfig({
  base: '/vocaciones/', // Set the base to /vocaciones/
  title: '¿Quién soy?',
  cleanUrls: true,
  description: 'Vocaciones Navarra',
  transformPageData(pageData) {
    const fm = pageData.frontmatter
    if (fm) renderMarkdownFields(fm)
    return pageData
  }
})
