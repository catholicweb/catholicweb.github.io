import { defineConfig } from "vitepress";

import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
import fg from "fast-glob";
import path from "path";

/** Recursively render all `description` fields in an object */
function renderMarkdownFields(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === "description" && typeof value === "string") {
      obj[key + "Html"] = md.render(value); // e.g. textHtml
    } else if (typeof value === "object") {
      renderMarkdownFields(value);
    }
  }
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\/]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateRewrites(docsDir) {
  const files = fg.sync("**/*.md", {
    cwd: docsDir,
    ignore: ["node_modules", ".vitepress"],
  });

  console.log(docsDir);

  const rewrites = {};

  files.forEach((file) => {
    const parsed = path.parse(file);

    // Slugify each part of the directory path
    const dirParts = parsed.dir ? parsed.dir.split(path.sep) : [];
    const slugifiedDir = dirParts.map((part) => slugify(part)).join("/");

    // Slugify the filename
    const slugifiedName = slugify(parsed.name);

    // Construct the new path
    const slugifiedPath = slugifiedDir
      ? path.join(slugifiedDir, slugifiedName + ".md")
      : slugifiedName + ".md";

    // Only add rewrite if the slugified version differs
    if (file !== slugifiedPath) {
      rewrites[file] = slugifiedPath;
    }
  });

  return rewrites;
}

export default defineConfig({
  base: "/vocaciones/", // Set the base to /vocaciones/
  title: "¿Quién soy?",
  cleanUrls: true,
  rewrites: generateRewrites("./docs"),
  description: "Vocaciones Navarra",
  transformHead: ({ pageData }) => {
    return [
      ['meta', { name: 'keywords', content: 'navarra, vocaciones, seminario, vida consagrada' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: pageData.title || '¿Quién soy?' }],
      ['meta', { property: 'og:description', content: pageData.subtitle || 'Vocaciones Navarra' }],
      ['meta', { property: 'og:image', content: pageData.image || ''}],
      ['meta', { name: 'twitter:card', content: pageData.image  || ''  }],
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['meta', { property: 'og:description', content: pageData.description || 'Vocaciones Navarra'  }]
    ]
  },
  transformPageData(pageData) {
    const fm = pageData.frontmatter;
    if (fm) renderMarkdownFields(fm);
    return pageData;
  },
});
