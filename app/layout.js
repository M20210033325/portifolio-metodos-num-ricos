import "./globals.css";

export const metadata = {
  title: "Caderno de Métodos Numéricos — Fernando",
  description:
    "Registro de aprendizado da disciplina de Métodos Numéricos: métodos, código e visualizações.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="page-grid" aria-hidden="true" />
        <header className="site-header">
          <a href="/" className="site-brand">
            <span className="site-brand-mark">§</span>
            <span className="site-brand-text">
              Caderno de Métodos Numéricos
            </span>
          </a>
          <span className="site-tagline">
            registro de estudo — Fernando, Eng. de Produção, UFRN
          </span>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span>
            construído com Next.js · atualizado conforme a disciplina avança
          </span>
        </footer>
      </body>
    </html>
  );
}
