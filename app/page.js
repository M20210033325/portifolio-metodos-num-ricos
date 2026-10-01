import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">métodos numéricos · UFRN</p>
        <h1>Um caderno de estudo, publicado conforme a disciplina avança</h1>
        <p>
          Cada entrada registra um método: o problema que ele resolve, o
          algoritmo, e uma visualização de como ele converge (ou diverge).
          O objetivo não é substituir o livro-texto, e sim guardar a versão
          que fez sentido pra mim.
        </p>
      </section>

      <ul className="entry-list">
        {posts.length === 0 && (
          <li className="empty-state">
            nenhuma entrada publicada ainda — veja content/_modelo.mdx para
            adicionar a primeira.
          </li>
        )}
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="entry">
              <div className="entry-row">
                <span className="entry-title">{post.title}</span>
                <span className="entry-method">{post.method}</span>
              </div>
              <p className="entry-summary">{post.summary}</p>
              <span className={`status-badge ${post.status}`}>
                {post.status === "completo"
                  ? "completo"
                  : post.status === "em-andamento"
                  ? "em andamento"
                  : "pendente"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
