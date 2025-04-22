# Tecnologias do Projeto CRM-RBAC

## Frontend (`apps/web`)

### Frameworks e Bibliotecas Principais
- **Next.js** 15.3.1
- **React** 19
- **TypeScript**
- **Tailwind CSS** 4

### Componentes e UI
- **Shadcn UI** (Componentes de UI)
- **Framer Motion** (Animações)
- **React Hook Form** (Formulários)
- **Zod** (Validação)
- **Zustand** (Gerenciamento de Estado)
- **Recharts** (Gráficos)
- **Sonner** (Notificações)

## Backend (`apps/api`)

### Frameworks e Bibliotecas Principais
- **Fastify** (Framework Node.js)
- **Drizzle ORM** (Banco de dados)
- **Neon Database** (PostgreSQL)
- **JWT** (Autenticação)
- **Zod** (Validação)
- **Swagger/OpenAPI** (Documentação)

## Ferramentas e Configurações

### Gerenciamento e Desenvolvimento
- **Turborepo** (Monorepo)
- **PNPM** (Gerenciador de pacotes)

### Qualidade de Código
- **ESLint** (Linting)
- **Prettier** (Formatação de código)
- **TypeScript** (Tipagem estática)
- **Dotenv** (Variáveis de ambiente)

## Arquitetura
- R2 Cloudflare (Armazenamento de arquivos)

### Estrutura
- Monorepo com workspaces
- Paralel/Intercept routes (Next.js)
- API RESTful

### Segurança e Controle de Acesso
- Autenticação com JWT
- RBAC (Role-Based Access Control)