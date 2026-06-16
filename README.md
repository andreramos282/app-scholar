# App Scholar — Mobile + Backend

Projeto: Aplicativo Mobile de Gerenciamento de Boletim Acadêmico

## Requisitos
- Node.js
- npm
- PostgreSQL
- Expo CLI (para frontend)

## Variáveis de ambiente (backend)
Crie um arquivo `.env` no diretório `backend` com:

POSTGRESQL_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=uma_chave_secreta

## Rodar backend (desenvolvimento)
```bash
cd backend
npm install
# configurar .env
npm run dev
```

## Rodar frontend (Expo)
```bash
cd frontend
npm install
npm start
