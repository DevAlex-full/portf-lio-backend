# Portfolio CMS — Backend

API REST construída com **Fastify 4 + TypeScript + Prisma + PostgreSQL (Supabase)**.

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Fastify | ^4.28 | Framework HTTP |
| TypeScript | ^5.3 | Tipagem estática |
| Prisma | ^5.10 | ORM + Migrations |
| PostgreSQL | — | Banco de dados (Supabase) |
| Supabase Storage | — | Upload de arquivos |
| bcryptjs | ^2.4 | Hash de senhas |
| @fastify/jwt | ^8.0 | Autenticação JWT |
| @fastify/multipart | ^8.3 | Upload de arquivos |
| @fastify/cors | ^8.5 | CORS |
| pino-pretty | ^11.0 | Logger dev |

---

## Instalação e setup completo

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Preencha TODOS os valores no .env antes de continuar

# 3. Gerar Prisma client
npx prisma generate

# 4. Rodar migrations em produção (Supabase/Render)
npx prisma migrate deploy

# OU em desenvolvimento local
npx prisma migrate dev

# 5. Popular banco com dados iniciais do portfólio
npm run seed

# 6. Iniciar em desenvolvimento
npm run dev

# 7. Build para produção
npm run build

# 8. Iniciar em produção
npm start
```

---

## Estrutura de Pastas

```
portfolio-backend/
├── prisma/
│   ├── migrations/
│   │   ├── 20240101000000_init/
│   │   │   └── migration.sql      ← Schema inicial completo
│   │   └── migration_lock.toml
│   └── schema.prisma              ← 15 models Prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── certification.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── lead.controller.ts
│   │   ├── media.controller.ts
│   │   ├── project.controller.ts
│   │   ├── service.controller.ts
│   │   ├── single-record.controller.ts  ← hero, about, contact, settings
│   │   └── skill.controller.ts
│   ├── lib/
│   │   ├── prisma.ts                    ← Singleton PrismaClient
│   │   └── supabase.ts                  ← Client + helpers Storage
│   ├── plugins/
│   │   └── auth.plugin.ts               ← Decorator fastify.authenticate
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── content.routes.ts            ← certs, skills, services, leads, dashboard
│   │   ├── media.routes.ts
│   │   ├── project.routes.ts
│   │   └── single-record.routes.ts      ← hero, about, contact, settings
│   ├── types/
│   │   └── fastify.d.ts                 ← Augmentação de tipos
│   ├── seed.ts                          ← Seed com dados do portfólio
│   └── server.ts                        ← Bootstrap Fastify
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Endpoints

### Públicos (sem auth)

| Método | Rota | Descrição |
|---|---|---|
| GET | /health | Health check |
| POST | /api/auth/login | Login admin |
| GET | /api/projects | Projetos ativos |
| GET | /api/projects/:slug | Projeto por slug |
| GET | /api/certifications | Certificados ativos |
| GET | /api/skills | Skills ativas |
| GET | /api/services | Planos + extras ativos |
| GET | /api/hero | Dados do hero |
| GET | /api/about | Dados do sobre |
| GET | /api/contact | Dados de contato |
| GET | /api/settings | Configurações SEO |
| POST | /api/leads | Criar lead (formulário) |

### Admin (Bearer token obrigatório)

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/auth/me | Dados do admin logado |
| POST | /api/auth/change-password | Alterar senha |
| GET | /api/dashboard/stats | Stats do dashboard |
| GET | /api/projects/all | Todos os projetos |
| POST/PUT/DELETE | /api/projects | CRUD projetos |
| PATCH | /api/projects/:id/order | Reordenar |
| GET/POST/PUT/DELETE | /api/certifications | CRUD certificados |
| GET/POST/PUT/DELETE | /api/skills | CRUD habilidades |
| GET/POST/PUT/DELETE | /api/services/plans | CRUD planos |
| GET/POST/PUT/DELETE | /api/services/extras | CRUD extras |
| GET/PATCH/DELETE | /api/leads | Gestão de leads |
| GET/POST/DELETE | /api/media | Biblioteca de mídias |
| PUT | /api/hero | Atualizar hero |
| PUT | /api/about | Atualizar sobre |
| PUT | /api/contact | Atualizar contato |
| PUT | /api/settings | Atualizar SEO |

---

## Deploy no Render

1. Criar **Web Service** no Render
2. Conectar repositório GitHub
3. Configurar:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
4. Adicionar variáveis do `.env.example` em **Environment Variables**
5. No primeiro deploy, rodar via Render Shell:
   ```bash
   npx prisma migrate deploy && npm run seed
   ```

---

## Modelos do Banco (15)

| Model | Tipo | Descrição |
|---|---|---|
| Admin | — | Autenticação do painel |
| Media | — | Biblioteca de mídias |
| Hero | single | Seção hero |
| About | single | Seção sobre |
| Project | CRUD | Projetos do portfólio |
| Certification | CRUD | Certificações |
| Skill | CRUD | Habilidades técnicas |
| ServicePlan | CRUD | Planos de serviço |
| ServiceExtra | CRUD | Serviços extras |
| Contact | single | Dados de contato |
| SiteSettings | single | SEO e config global |
| Lead | CRUD | Leads capturados |
| BlogPost | futuro | Posts do blog |
| BlogCategory | futuro | Categorias do blog |
| SiteVisit | futuro | Analytics de visitas |
