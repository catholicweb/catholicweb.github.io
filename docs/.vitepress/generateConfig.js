import MarkdownIt from "markdown-it";
import fg from "fast-glob";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

const md = new MarkdownIt();

/** Renderiza los campos "body" como HTML */
function renderMarkdownFields(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === "cuerpo" && typeof value === "string") {
      obj[key + "Html"] = md.render(value);
      console.log(key, obj);
    } else if (typeof value === "object") {
      renderMarkdownFields(value);
    }
  }
}

/* MODIFY LINKS */
function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  return matter(content).data || {};
}

function addLinks(frontmatter) {
  // Only process if 'links' field exists
  if (!frontmatter.links || !frontmatter.links.map) return;

  const baseDir = path.resolve("");
  const elements = frontmatter.links.map((linkPath) => {
    const fullPath = path.resolve(baseDir, linkPath);
    const fm = readFrontmatter(fullPath);
    return {
      title: fm.title || path.basename(linkPath, ".md"),
      description: fm.description || "",
      image: fm.image || "",
      link: linkPath.replace("docs/", "").replace(".md", ""),
    };
  });

  const newBlock = {
    type: "gallery-feature",
    title: frontmatter.linksTitle || "Enlaces",
    description: frontmatter.galleryDescription || "",
    elements,
  };

  // Merge (don’t overwrite)
  frontmatter.blocks = Array.isArray(frontmatter.blocks) ? [...frontmatter.blocks, newBlock] : [newBlock];

  // Must return modified pageData for VitePress to pick it up
  return frontmatter;
}

async function generateNav(data) {
  // Build VitePress nav
  return data.nav.map((section) => ({
    text: section.title,
    items: section.links.map((linkPath) => ({
      text: readFrontmatter(linkPath)?.title || path.basename(linkPath, ".md"),
      link: "/" + linkPath.replace(/^docs\//, "").replace(/\.md$/, ""),
    })),
  }));
}

/** Genera el árbol de navegación */
async function generateNav2() {
  const files = fg.sync(["**/*.md"], {
    cwd: "./docs/",
    ignore: ["node_modules", ".vitepress", "index.md"],
  });

  const posts = files.map((file) => {
    const parts = file.split("/").filter(Boolean);

    // Leer frontmatter
    const content = fs.readFileSync(`./docs/${file}`, "utf-8");
    const { data } = matter(content);
    const title = data.title || parts[parts.length - 1].replace(".md", "");

    return { file, parts, title };
  });

  const tree = [];

  const insertNode = (tree, parts, file, title) => {
    const [head, ...tail] = parts;
    if (!head) return;
    let node = tree.find((n) => n.key === head);
    if (!node) {
      node = { key: head, title: head, children: [], posts: [] };
      tree.push(node);
    }
    if (tail.length === 0) node.posts.push({ file, title });
    else insertNode(node.children, tail, file, title);
  };

  for (const post of posts) insertNode(tree, post.parts, post.file, post.title);

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.title.localeCompare(b.title));
    nodes.forEach((n) => sortTree(n.children));
  };
  sortTree(tree);

  const toVitepressNav = (nodes) =>
    nodes.map((n) => {
      if (n.children.length === 0) {
        const items = n.posts.map((p) => ({
          text: p.title.replaceAll("-", " "),
          link: "/" + p.file.replace(".md", ".html"),
        }));
        return items.length === 1 ? { text: items[0].text, link: items[0].link } : { text: n.title, items };
      }
      return { text: n.title, items: toVitepressNav(n.children) };
    });

  return toVitepressNav(tree);
}

function googleFont(theme, weights = "400,700", styles = "normal,italic") {
  // Google Fonts URL format
  const baseURL = "https://fonts.googleapis.com/css2";
  return `${baseURL}?family=${theme.bodyFont.replace(/\s+/g, "+")}&family=${theme.headingFont.replace(/\s+/g, "+")}&display=swap`;
}

async function printCSS(config) {
  let css = `/* global.css or in your <style> block */
:root {
  --font-body: '${config.theme.bodyFont}', sans-serif;
  --font-heading: '${config.theme.headingFont}', sans-serif;
}

/* You can also include other global styles */
body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

@keyframes scrolled {
  to {
    opacity: 1;          /* fully visible */
    transform: scale(1) rotate(0) translate(0); /* no scaling or translation */
  }
}\n\n`;

  config.styles.forEach(({ selector, cssClass, scroll }) => {
    if (scroll) {
      css += `${selector} {
  ${cssClass};
  animation: scrolled linear both;
  animation-timeline: view();
  animation-range: entry 30% cover 30%;
}\n\n`;
    } else {
      css += `${selector} {  ${cssClass}; }\n\n`;
    }
  });

  const baseDir = path.resolve("");
  console.log(baseDir);
  fs.writeFileSync(baseDir + "/docs/.vitepress/theme/vars.css", css, "utf8");
}

export async function generate() {
  let config = readFrontmatter("./config.md");

  config.languages = [
    { code: "es", label: "Español", path: "/" },
    { code: "en", label: "English", path: "en/" },
    { code: "eus", label: "Euskara", path: "eus/" },
  ];

  console.log(config);

  await printCSS(config);

  return {
    head: [
      // Preconnect to Google Fonts and Fonts CDN
      ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" }],
      // Link to the Google Font stylesheet
      ["link", { href: googleFont(config.theme), rel: "stylesheet" }],
    ],
    title: config.title,
    cleanUrls: true,
    description: config.description,
    themeConfig: {
      nav: await generateNav(config),
      languages: config.languages,
    },
    /*transformHead: ({ pageData }) => [
      ["meta", { name: "keywords", content: "navarra, vocaciones, seminario, vida consagrada" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: pageData.title || "¿Quién soy?" }],
      ["meta", { property: "og:description", content: pageData.subtitle || "Vocaciones Navarra" }],
      ["meta", { property: "og:image", content: pageData.image || "" }],
      ["meta", { name: "twitter:card", content: pageData.image || "" }],
      ["link", { rel: "icon", href: "/favicon.ico" }],
      ["meta", { property: "og:description", content: pageData.description || "Vocaciones Navarra" }],
    ],*/
    transformPageData(pageData) {
      const fm = pageData.frontmatter;
      if (fm) {
        renderMarkdownFields(fm);
        addLinks(fm);
      }
      return pageData;
    },
  };
}
