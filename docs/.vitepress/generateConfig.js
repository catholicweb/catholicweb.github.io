import MarkdownIt from "markdown-it";
import fg from "fast-glob";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

const md = new MarkdownIt();

/** Convierte un string a slug */
export function slugify(str) {
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

/** Renderiza los campos "body" como HTML */
export function renderMarkdownFields(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === "body" && typeof value === "string") {
      obj[key + "Html"] = md.render(value);
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
export function addLinks(frontmatter) {
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

/** Genera rewrites para los ficheros de docs */
export function generateRewrites(docsDir) {
  const files = fg.sync("**/*.md", {
    cwd: "./docs",
    ignore: ["node_modules", ".vitepress"],
  });

  const rewrites = {};
  for (const file of files) {
    const parsed = path.parse(file);
    const dirParts = parsed.dir ? parsed.dir.split(path.sep) : [];
    const slugifiedDir = dirParts.map(slugify).join("/");
    const slugifiedName = slugify(parsed.name);
    const slugifiedPath = slugifiedDir ? path.join(slugifiedDir, slugifiedName + ".md") : slugifiedName + ".md";
    if (file !== slugifiedPath) rewrites[file] = slugifiedPath;
  }

  return rewrites;
}

export async function generateNav() {
  // Path to your config.md
  const configPath = path.resolve("./config.md");

  // Parse frontmatter
  const configContent = fs.readFileSync(configPath, "utf8");
  const { data } = matter(configContent);

  const baseDir = path.dirname(configPath);

  // Helper: extract title from each linked doc
  function getDocTitle(filePath) {
    const fullPath = path.resolve(baseDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Missing file: ${fullPath}`);
      return path.basename(filePath, ".md");
    }
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const { data: fm } = matter(fileContent);
    return fm.title || path.basename(filePath, ".md");
  }

  // Build VitePress nav
  const vitepressNav = data.nav.map((section) => ({
    text: section.title,
    items: section.links.map((linkPath) => ({
      text: getDocTitle(linkPath),
      link: "/" + linkPath.replace(/^docs\//, "").replace(/\.md$/, ""),
    })),
  }));

  return vitepressNav;
}

/** Genera el árbol de navegación manualmente (sin createContentLoader) */
export async function generateNav2() {
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
