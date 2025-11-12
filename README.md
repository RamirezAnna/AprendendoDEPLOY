# AprendendoDEPLOY — Cadastro com MongoDB Atlas

Este repositório contém uma página de cadastro (frontend) e uma API (Node/Express/Mongoose) pronta para MongoDB Atlas. Em produção (Vercel) usamos funções serverless na pasta `api/` e servimos o `index.html` da raiz como página inicial.

Principais arquivos
- `index.html` — página de cadastro na raiz; servida em `/` no Vercel e também localmente.
- `api/signup.js` — função serverless de cadastro.
- `api/health.js` — função serverless de verificação rápida (GET `/api/health`).
- `models/User.js` — modelo Mongoose (evita OverwriteModelError em serverless com `mongoose.models`).
- `server.js` — servidor local de desenvolvimento (não usado pelo Vercel).
- `.env.example` — exemplo de variáveis (`MONGO_URI`, `PORT`).
- `package.json` — dependências e scripts (inclui `vercel-build` para evitar detecção de Next.js).

Rodando localmente
1) Crie `.env` a partir de `.env.example` e preencha `MONGO_URI` (string do MongoDB Atlas).
2) Instale as dependências:

```powershell
npm install
```

3) Inicie o servidor local (porta 3000):

```powershell
npm run dev
```

4) Acesse:
- Página: http://localhost:3000/
- API: POST http://localhost:3000/api/signup (JSON: `{ nome, email, senha }`)
- Saúde: GET http://localhost:3000/api/health

Deploy no Vercel
- Variáveis: adicione `MONGO_URI` em Project → Settings → Environment Variables (Production e Preview, se necessário).
- Root Directory: mantenha `/` (raiz do repositório).
- Framework: o `vercel.json` já define `framework: null`. Não é Next.js. A build é pulada via script `vercel-build`.
- Após publicar, valide:
  - GET https://seu-projeto.vercel.app/api/health → `{ ok: true }`.
  - POST https://seu-projeto.vercel.app/api/signup com `{ nome, email, senha }`.
  - `/` deve mostrar o `index.html`.

Notas de segurança
- Senhas são hasheadas com `bcrypt` (saltRounds = 10). Recomenda-se adicionar HTTPS, políticas de senha, verificação de e-mail e rate limiting para produção.

Deseja adicionar login/JWT, confirmação de e-mail ou testes automatizados? Abra uma issue ou peça aqui que eu implemento.