# AprendendoDEPLOY — Cadastro com MongoDB Atlas

Este repositório contém uma página de cadastro (frontend) e um backend de exemplo (Node/Express + Mongoose) configurado para conectar ao MongoDB Atlas.

Estrutura relevante
- `public/signup.html` — página de cadastro servida como arquivo estático no Vercel.
- `server.js` — backend; expõe `POST /api/signup` e serve o frontend em `public/`.
- `api/signup.js` — função serverless do Vercel para cadastro de usuários.
- `api/health.js` — função serverless simples para verificação (GET /api/health).
- `models/User.js` — modelo Mongoose para usuários.
- `.env.example` — modelo para variáveis de ambiente (MONGO_URI, PORT).
- `package.json` — dependências (inclui `bcrypt` para hashing de senhas).

Como usar localmente
1. Copie `.env.example` para `.env` e preencha `MONGO_URI` com sua connection string do MongoDB Atlas.
2. Instale dependências:

```powershell
npm install
```

3. Inicie o servidor:

```powershell
npm run dev
```

4. Abra no navegador:

- Frontend: http://localhost:3000/signup.html (ou apenas http://localhost:3000)
- Endpoint de API: POST http://localhost:3000/api/signup

No Vercel
- Configure em Project > Settings > Environment Variables a variável `MONGO_URI` (Production e Preview, se desejar).
- Após o deploy, teste:
	- GET https://seu-projeto.vercel.app/api/health → deve responder `{ ok: true }`.
	- POST https://seu-projeto.vercel.app/api/signup com JSON `{ nome, email, senha }`.

Notas de segurança
- As senhas são hasheadas com `bcrypt` (saltRounds = 10) antes de serem salvas. Ainda assim, em produção considere práticas adicionais: TLS/HTTPS, políticas de senha, verificação por e-mail, proteção contra brute-force (rate-limiting), etc.

Se quiser que eu adicione autenticação (login + JWT), verificação por e-mail, ou testes automatizados, diga qual e eu implemento em seguida.