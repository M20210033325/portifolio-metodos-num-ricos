import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Lista todas as entradas (posts) do caderno, na ordem da ementa da disciplina
// (campo `order` no frontmatter). Entradas sem `order` vão pro final, por data.
export function getAllPosts() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(CONTENT_DIR, file);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    return { slug, ...data };
  });

  return posts.sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return new Date(b.date) - new Date(a.date);
  });
}

// Retorna o conteúdo bruto (fonte MDX) + frontmatter de um post específico.
export function getPostBySlug(slug) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  return { slug, meta: data, content };
}

export function getAllSlugs() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
