import MarkdownIt from "markdown-it";
import fg from "fast-glob";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

const md = new MarkdownIt();

/* MODIFY LINKS */
function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  return matter(content).data || {};
}

function autocomplete(fm, config) {
  if (!fm.sections) return;
  addMeta(fm, config);
  for (var i = 0; i < fm.sections.length; i++) {
    if (typeof fm.sections[i].html === "string") {
      fm.sections[i].html = md.render(fm.sections[i].html);
    }
    if (fm.sections[i]._block == "links") {
      fm.sections[i] = addLinks(fm.sections[i]);
    }
  }
}

function addMeta(fm, config) {
  fm.head ??= [];
  fm.head.push(["meta", { property: "og:type", content: "website" }], ["meta", { property: "og:title", content: fm.title || config.title }], ["meta", { property: "og:description", content: fm.description || config.description }], ["meta", { property: "og:image", content: fm.image || config.image }], ["name", { property: "twitter:card", content: fm.image || config.image }]);
}

function addLinks(section) {
  if (!section.links || !section.links.map) return;

  const baseDir = path.resolve("");
  section.elements = section.links.map((linkPath) => {
    const fullPath = path.resolve(baseDir, linkPath);
    const fm = readFrontmatter(fullPath);
    return {
      title: fm.title || path.basename(linkPath, ".md"),
      description: fm.description || "",
      image: fm.image || "",
      link: linkPath.replace("docs/", "").replace(".md", ""),
    };
  });
  section._block = "gallery-feature";
  return section;
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
  /* === Your core parameters === */
  --font-body: '${config.theme.bodyFont}', sans-serif;
  --font-heading: '${config.theme.headingFont}', sans-serif;
  --accent-color: ${config.theme.accentColor};
  --primary-color: ${config.theme.accentPrimary};
  --border-radius-mult: ${config.theme.borderRadius};
  --border-width-mult: ${config.theme.borderWidth};
  --shadow-depth-mult: ${config.theme.shadowDepth};

    
  /* === Derived Tailwind vars (reactive) === */

    /* Radius */
    --radius-sm: calc(0.125rem * var(--border-radius-mult));
    --radius: calc(0.25rem * var(--border-radius-mult));
    --radius-md: calc(0.375rem * var(--border-radius-mult));
    --radius-lg: calc(0.5rem * var(--border-radius-mult));
    --radius-xl: calc(0.75rem * var(--border-radius-mult));
    --radius-2xl: calc(1rem * var(--border-radius-mult));
    --radius-3xl: calc(1.5rem * var(--border-radius-mult));
    --radius-full: 9999px;

    /* Border widths */
    --border-width: calc(1px * var(--border-width-mult));
    --border-width-2: calc(2px * var(--border-width-mult));
    --border-width-4: calc(4px * var(--border-width-mult));
    --border-width-8: calc(8px * var(--border-width-mult));

    /* Shadows */
    --shadow-color: 0 0% 0% / 0.15;
    --shadow-sm: 0 calc(1px * var(--shadow-depth-mult)) calc(2px * var(--shadow-depth-mult)) hsl(var(--shadow-color));
    --shadow: 0 calc(1px * var(--shadow-depth-mult)) calc(3px * var(--shadow-depth-mult)) hsl(var(--shadow-color)),
              0 calc(1px * var(--shadow-depth-mult)) calc(2px * var(--shadow-depth-mult)) hsl(var(--shadow-color));
    --shadow-md: 0 calc(4px * var(--shadow-depth-mult)) calc(6px * var(--shadow-depth-mult)) -1px hsl(var(--shadow-color)),
                 0 calc(2px * var(--shadow-depth-mult)) calc(4px * var(--shadow-depth-mult)) -2px hsl(var(--shadow-color));
    --shadow-lg: 0 calc(10px * var(--shadow-depth-mult)) calc(15px * var(--shadow-depth-mult)) -3px hsl(var(--shadow-color)),
                 0 calc(4px * var(--shadow-depth-mult)) calc(6px * var(--shadow-depth-mult)) -4px hsl(var(--shadow-color));
    --shadow-xl: 0 calc(20px * var(--shadow-depth-mult)) calc(25px * var(--shadow-depth-mult)) -5px hsl(var(--shadow-color)),
                 0 calc(10px * var(--shadow-depth-mult)) calc(10px * var(--shadow-depth-mult)) -5px hsl(var(--shadow-color));

    /* Apply directly to Tailwind font vars */
    --font-sans: var(--font-body);
    --font-display: var(--font-heading);
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

  config.theme.styles.forEach(({ selector, cssClass, scroll }) => {
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
  fs.writeFileSync(baseDir + "/docs/.vitepress/theme/vars.css", css, "utf8");
}

export async function generate() {
  let config = readFrontmatter("./config.md");

  config.languages = [
    { code: "es", label: "Español", path: "/" },
    { code: "en", label: "English", path: "en/" },
    { code: "eus", label: "Euskara", path: "eus/" },
  ];

  await printCSS(config);
  const FONT_URL = googleFont(config.theme);

  async function getFontCSS(url) {
    const res = await fetch(url);
    let css = await res.text();
    if (!css.includes("font-display")) css = css.replace(/}/g, "font-display:swap;}");
    return css;
  }

  return {
    head: [
      // Preconnect to Google Fonts and Fonts CDN
      //["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" }],
      // Link to the Google Font stylesheet
      ["style", {}, await getFontCSS(FONT_URL)],
    ],
    title: config.title,
    cleanUrls: true,
    description: config.description,
    themeConfig: {
      nav: await generateNav(config),
      languages: config.languages,
    },
    transformPageData(pageData) {
      const fm = pageData.frontmatter;
      if (fm) autocomplete(fm, config);
      return pageData;
    },
  };
}
