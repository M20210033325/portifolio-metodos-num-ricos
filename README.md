# Caderno de Métodos Numéricos

Portfólio/caderno de estudo da disciplina de Métodos Numéricos. Cada método
vira uma entrada com texto, código e (quando fizer sentido) uma visualização
interativa que roda o algoritmo de verdade no navegador.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Como adicionar uma nova entrada (o dia a dia)

Já existe uma entrada `.mdx` pra cada tópico da ementa (em `content/`), na
ordem que o professor passou (`order: 1` a `15`), a maioria como
`status: "pendente"`. Conforme a matéria avança:

1. Abra o arquivo do tópico correspondente em `content/` (o nome do arquivo
   é a URL: `/posts/nome-do-arquivo`).
2. Preencha `subtitle` e `summary` no frontmatter.
3. Troque `status` de `"pendente"` pra `"em-andamento"` (estudando agora) ou
   `"completo"` (fechado) — isso controla o selo na home.
4. Escreva o conteúdo em markdown normal, substituindo o texto placeholder.
   Componentes disponíveis sem import: `<Note>`, `<Note type="error">`,
   `<Readout iteration=".." error=".." status="ok" />`.
5. Salve, rode `npm run dev` e confira em `/posts/nome-do-arquivo`.

Pra um tópico que não estava na ementa original, copie
`content/_modelo.mdx.txt`, dê um `order` que reflita onde ele entra na
sequência (ex: `5.5` funciona, os números só precisam manter a ordem).

## Adicionando um widget interativo pra um método novo

O de bisseção (`components/ConvergencePlot.jsx`) serve de modelo: recebe
parâmetros via `useState`, roda o algoritmo em JS puro, desenha um SVG e uma
tabela de iterações. Pra um método novo (Newton, Gauss-Seidel, Simpson...):

1. Crie `components/NomeDoWidget.jsx` (comece copiando o do bisseção e troque
   a lógica do algoritmo).
2. Registre o componente em
   `app/posts/[slug]/page.js`, dentro do objeto `mdxComponents`.
3. Use `<NomeDoWidget />` dentro do `.mdx` do post.

## Deploy (Vercel — grátis)

1. Suba este projeto pra um repositório no GitHub.
2. Em https://vercel.com, "Add New Project" → importe o repositório.
3. Vercel detecta Next.js automaticamente — não precisa configurar nada.
4. Cada `git push` na branch principal atualiza o site publicado
   automaticamente.

Se quiser um domínio próprio (ex: `seunome.dev`), dá pra apontar em
Project Settings → Domains, depois de comprado num registrador qualquer.

## Estrutura

```
app/
  page.js                → lista todas as entradas (home)
  posts/[slug]/page.js    → renderiza uma entrada em MDX
  globals.css             → estilo do site inteiro
content/
  *.mdx                   → uma entrada por arquivo (isso você edita sempre)
  _modelo.mdx.txt         → modelo pra copiar ao criar uma entrada nova
components/
  ConvergencePlot.jsx     → widget interativo do método da bisseção
  Readout.jsx             → selo de iteração/erro/status reutilizável
  Note.jsx                → caixa de destaque (definição / erro comum)
lib/
  posts.js                → lê os arquivos de content/ e o frontmatter
```
