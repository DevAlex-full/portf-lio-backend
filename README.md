# Portfólio CMS — Backend

API REST do **Portfólio CMS** de Alex Bueno, responsável por autenticação, gerenciamento de conteúdo, upload de mídias, dados públicos do site, dashboard administrativo, clientes, feedbacks, projetos, leads e configurações globais.

> **Status:** produção  
> **Base URL:** https://portf-lio-backend.onrender.com  
> **Tipo de projeto:** proprietário / não open source

---

## Visão Geral

Este repositório contém o backend do portfólio profissional, desenvolvido com **Node.js**, **Fastify**, **TypeScript**, **Prisma ORM** e **PostgreSQL via Supabase**.

A API foi criada para alimentar o frontend público e o painel administrativo do portfólio, permitindo que todo o conteúdo seja gerenciado via CMS, sem edição manual no código.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework HTTP | Fastify |
| Linguagem | TypeScript |
| ORM | Prisma |
| Banco de Dados | PostgreSQL / Supabase |
| Storage | Supabase Storage |
| Autenticação | JWT |
| Hash de Senhas | bcryptjs |
| Upload | @fastify/multipart |
| Segurança | CORS, Helmet, validações e rotas protegidas |
| Deploy | Render |

---

## Principais Recursos

- API pública para o site institucional.
- API administrativa protegida por JWT.
- Login administrativo.
- Dashboard com indicadores consolidados.
- CRUD de projetos.
- CRUD de clientes/cases.
- CRUD de feedbacks/depoimentos.
- CRUD de certificações.
- CRUD de habilidades.
- CRUD de serviços e pacotes.
- Gestão de leads.
- Gestão de mídia e upload para Supabase Storage.
- Gestão de Hero, Sobre, Contato e Configurações SEO.
- Seed idempotente com dados iniciais.
- Migrations versionadas com Prisma.
- Deploy em produção no Render.

---

## Arquitetura

```txt
portf-lio-backend/
├── prisma/
│   ├── migrations/
│   │   ├── 20240101000000_init/
│   │   ├── 20240115000000_add_lead_source/
│   │   ├── 20240201000000_add_client_model/
│   │   ├── 20240210000000_add_client_status/
│   │   └── 20240220000000_add_feedbacks/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── certification.controller.ts
│   │   ├── client.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── feedback.controller.ts
│   │   ├── lead.controller.ts
│   │   ├── media.controller.ts
│   │   ├── project.controller.ts
│   │   ├── service.controller.ts
│   │   ├── single-record.controller.ts
│   │   └── skill.controller.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── supabase.ts
│   ├── plugins/
│   │   └── auth.plugin.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── client.routes.ts
│   │   ├── content.routes.ts
│   │   ├── feedback.routes.ts
│   │   ├── media.routes.ts
│   │   ├── project.routes.ts
│   │   └── single-record.routes.ts
│   ├── types/
│   │   └── fastify.d.ts
│   ├── seed.ts
│   └── server.ts
├── .env.example
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Modelos Principais

| Model | Descrição |
|---|---|
| Admin | Usuário administrativo do CMS |
| Media | Biblioteca de arquivos e uploads |
| Hero | Conteúdo da seção principal |
| About | Conteúdo institucional |
| Project | Projetos do portfólio |
| Client | Clientes e cases reais |
| Feedback | Depoimentos e prova social |
| Certification | Certificações profissionais |
| Skill | Habilidades técnicas |
| ServicePlan | Planos e pacotes comerciais |
| ServiceExtra | Serviços extras |
| Contact | Dados de contato e redes sociais |
| SiteSettings | SEO e configurações globais |
| Lead | Leads capturados pelo site |
| BlogPost | Estrutura para conteúdo/blog |
| BlogCategory | Categorias de blog |
| SiteVisit | Estrutura para métricas de acesso |

---

## Endpoints Públicos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Health check da API |
| POST | `/api/auth/login` | Login administrativo |
| GET | `/api/projects` | Projetos ativos |
| GET | `/api/projects/:slug` | Projeto por slug |
| GET | `/api/clients` | Clientes ativos |
| GET | `/api/feedbacks` | Feedbacks ativos |
| GET | `/api/certifications` | Certificações ativas |
| GET | `/api/skills` | Habilidades ativas |
| GET | `/api/services` | Planos e serviços ativos |
| GET | `/api/hero` | Dados do Hero |
| GET | `/api/about` | Dados do Sobre |
| GET | `/api/contact` | Dados de Contato |
| GET | `/api/settings` | Configurações públicas e SEO |
| POST | `/api/leads` | Cadastro de lead |

---

## Endpoints Administrativos

Rotas administrativas exigem autenticação via Bearer Token.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/auth/me` | Dados do admin logado |
| POST | `/api/auth/change-password` | Alteração de senha |
| GET | `/api/dashboard/stats` | Indicadores do dashboard |
| GET/POST/PUT/DELETE | `/api/projects` | Gestão de projetos |
| GET/POST/PUT/DELETE | `/api/clients` | Gestão de clientes |
| GET/POST/PUT/DELETE | `/api/feedbacks` | Gestão de feedbacks |
| GET/POST/PUT/DELETE | `/api/certifications` | Gestão de certificações |
| GET/POST/PUT/DELETE | `/api/skills` | Gestão de habilidades |
| GET/POST/PUT/DELETE | `/api/services/plans` | Gestão de planos |
| GET/POST/PUT/DELETE | `/api/services/extras` | Gestão de extras |
| GET/PATCH/DELETE | `/api/leads` | Gestão de leads |
| GET/POST/DELETE | `/api/media` | Biblioteca de mídias |
| PUT | `/api/hero` | Atualização do Hero |
| PUT | `/api/about` | Atualização do Sobre |
| PUT | `/api/contact` | Atualização de Contato |
| PUT | `/api/settings` | Atualização de SEO/configurações |

---

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`.

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

> Nunca versionar `.env` com valores reais.

---

## Setup Local

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Aplicar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais
npm run seed

# Rodar em desenvolvimento
npm run dev
```

API local:

```txt
http://localhost:3001
```

Health check:

```txt
http://localhost:3001/health
```

---

## Build e Produção

```bash
# Build de produção
npm run build

# Start em produção
npm start
```

No Render, a configuração recomendada é:

```txt
Build Command: npm install --include=dev && npm run build
Start Command: node dist/server.js
```

As migrations devem ser aplicadas de forma controlada:

```bash
npx prisma migrate deploy
npm run seed
```

---

## Migrations

O histórico de migrations deve permanecer imutável após aplicado em produção.

Regras adotadas:

- Não editar migrations já aplicadas.
- Criar sempre migrations aditivas para novas tabelas/campos.
- Validar localmente com `npx prisma generate` e `npm run build` antes do deploy.
- Usar `prisma migrate deploy` em produção.

---

## Segurança

- Rotas administrativas protegidas por JWT.
- Senhas armazenadas com hash bcrypt.
- Upload controlado por validação de arquivo.
- CORS configurado para o frontend autorizado.
- Variáveis sensíveis fora do repositório.
- Service Role do Supabase usada somente no backend.

---

## Licença e Uso

Este projeto é **proprietário** e **não é open source**.

O código, estrutura de API, controllers, seed, migrations, modelos de banco, regras de negócio e integrações pertencem ao autor. Não é permitido copiar, redistribuir, revender, publicar ou reutilizar este backend sem autorização expressa.

---

## Autor

**Alex Bueno**  
Desenvolvedor Full Stack

- Portfólio: https://portifoliodevalex.vercel.app/
- Backend: https://portf-lio-backend.onrender.com
- GitHub: https://github.com/DevAlex-full
- LinkedIn: https://www.linkedin.com/in/alexander-bueno-43823a358/
- Instagram: https://www.instagram.com/alexbueno.dev/
