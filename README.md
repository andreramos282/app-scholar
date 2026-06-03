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
# ou use `npm run android` / `npm run ios`
```

## Endpoints importantes (exemplos curl)
- Registrar aluno (backend)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"aluno1@example.com","nome":"Aluno Teste","senha":"123456"}'
```

- Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"login":"aluno1@example.com","senha":"123456"}'
```
Resposta esperada:
```json
{ "token": "<jwt>", "usuario": { "id":1, "email":"...", "nome":"...", "perfil":"aluno", "matricula":"MAT-..." } }
```

- Criar aluno (protegido)

```bash
curl -X POST http://localhost:3000/api/aluno \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"matricula":"20240001","nome":"Fulano","curso":"DSM","email":"fulano@ex.com"}'
```

- Buscar boletim por matrícula (protegido)

```bash
curl -X GET http://localhost:3000/api/boletim/MAT-... \
  -H 'Authorization: Bearer <TOKEN>'
```

