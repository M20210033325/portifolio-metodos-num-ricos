import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import ConvergencePlot from "@/components/ConvergencePlot";
import Readout from "@/components/Readout";
import Note from "@/components/Note";

// Componentes que ficam disponíveis dentro de qualquer arquivo .mdx,
// sem precisar de import manual em cada post.
const mdxComponents = {
  ConvergencePlot,
  Readout,
  Note,
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }) {
  const { meta, content } = getPostBySlug(params.slug);

  return (
    <article>
      <header className="post-header">
        <Link href="/" className="post-back">
          ← todas as entradas
        </Link>
        <h1>{meta.title}</h1>
        {meta.subtitle && <p className="post-subtitle">{meta.subtitle}</p>}
        <div className="post-meta">
          <span>
            método: <strong>{meta.method}</strong>
          </span>
          <span>
            status: <strong>{meta.status}</strong>
          </span>
          {meta.date && (
            <span>
              atualizado: <strong>{meta.date}</strong>
            </span>
          )}
        </div>
      </header>

      <div className="post-body">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  );
}
