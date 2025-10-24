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

/** Renderiza los campos "description" como HTML */
export function renderMarkdownFields(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === "description" && typeof value === "string") {
      obj[key + "Html"] = md.render(value);
    } else if (typeof value === "object") {
      renderMarkdownFields(value);
    }
  }
}

/** Genera rewrites para los ficheros de docs */
export function generateRewrites(docsDir) {
  const files = fg.sync("**/*.md", {
    cwd: './docs',
    ignore: ["node_modules", ".vitepress"],
  });

  const rewrites = {};
  for (const file of files) {
    const parsed = path.parse(file);
    const dirParts = parsed.dir ? parsed.dir.split(path.sep) : [];
    const slugifiedDir = dirParts.map(slugify).join("/");
    const slugifiedName = slugify(parsed.name);
    const slugifiedPath = slugifiedDir
      ? path.join(slugifiedDir, slugifiedName + ".md")
      : slugifiedName + ".md";
    if (file !== slugifiedPath) rewrites[file] = slugifiedPath;
  }

  return rewrites;
}
/** Genera el árbol de navegación manualmente (sin createContentLoader) */
export async function generateNav() {
  const files = fg.sync(["**/*.md"], {
    cwd: "./docs/",
    ignore: ["node_modules", ".vitepress"],
  });

  const posts = files.map(file => {
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
    let node = tree.find(n => n.key === head);
    if (!node) {
      node = { key: head, title: head, children: [], posts: [] };
      tree.push(node);
    }
    if (tail.length === 0) node.posts.push({ file, title });
    else insertNode(node.children, tail, file, title);
  };

  for (const post of posts) insertNode(tree, post.parts, post.file, post.title);

  const sortTree = nodes => {
    nodes.sort((a, b) => a.title.localeCompare(b.title));
    nodes.forEach(n => sortTree(n.children));
  };
  sortTree(tree);

  const toVitepressNav = nodes =>
    nodes.map(n => {
      if (n.children.length === 0) {
        const items = n.posts.map(p => ({
          text: p.title.replaceAll("-", " "),
          link: "/" + p.file.replace(".md", ".html"),
        }));
        return items.length === 1
          ? { text: items[0].text, link: items[0].link }
          : { text: n.title, items };
      }
      return { text: n.title, items: toVitepressNav(n.children) };
    });

  return toVitepressNav(tree);
}
