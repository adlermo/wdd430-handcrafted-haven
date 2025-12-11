# 🚀 Quick Start Guide - Handcrafted Haven

Este guia vai te ajudar a configurar o projeto localmente e começar a desenvolver.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior ([Download](https://nodejs.org/))
- **PostgreSQL** 14 ou superior ([Download](https://www.postgresql.org/download/))
- **pnpm** (recomendado) ou npm
  ```bash
  npm install -g pnpm
  ```

## 🎯 Passos para Inicialização

### 1. Instalar Dependências

```bash
pnpm install
# ou
npm install
```

### 2. Configurar o Banco de Dados

#### a) Criar o banco de dados PostgreSQL

```bash
# Acesse o PostgreSQL
psql postgres

# Crie o banco de dados
CREATE DATABASE handcrafted_haven;

# Crie um usuário (opcional)
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE handcrafted_haven TO seu_usuario;

# Saia do psql
\q
```

#### b) Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/handcrafted_haven?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-seguro-aqui" # Gere com: openssl rand -base64 32

# Vercel Blob Storage (opcional para desenvolvimento local)
BLOB_READ_WRITE_TOKEN=""
```

### 3. Executar Migrações do Prisma

```bash
# Gerar o Prisma Client
pnpm db:generate

# Criar as tabelas no banco de dados
pnpm db:push

# Ou use migrations para ambientes de produção
pnpm db:migrate
```

### 4. (Opcional) Visualizar o Banco de Dados

O Prisma Studio é uma interface visual para o seu banco:

```bash
pnpm db:studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode visualizar e editar dados.

### 5. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

## 🧪 Testando o Sistema

### Criar sua primeira conta

1. Acesse [http://localhost:3000/register](http://localhost:3000/register)
2. Preencha o formulário de registro
3. Escolha entre "Buyer" ou "Seller"
4. Faça login em [http://localhost:3000/login](http://localhost:3000/login)

### Estrutura de Usuários

- **BUYER**: Usuários que navegam e compram produtos
- **SELLER**: Artesãos que vendem produtos (tem acesso ao dashboard de vendedor)
- **ADMIN**: Administradores do sistema (acesso total)

## 📁 Estrutura do Projeto

```
handcrafted-haven/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Rotas de autenticação (login, register)
│   │   ├── api/                 # API Routes
│   │   │   └── auth/            # Endpoints de autenticação
│   │   ├── layout.tsx           # Layout raiz
│   │   └── page.tsx             # Página inicial
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes de UI (Button, Input, etc)
│   │   └── layout/              # Componentes de layout (Header, Footer)
│   ├── lib/                     # Utilitários e configurações
│   │   ├── auth.ts              # Configuração NextAuth
│   │   ├── prisma.ts            # Cliente Prisma
│   │   └── utils.ts             # Funções auxiliares
│   └── types/                   # Definições TypeScript
├── prisma/
│   └── schema.prisma            # Schema do banco de dados
├── public/                      # Arquivos estáticos
└── package.json
```

## 🎨 Stack Tecnológica

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **Icons**: Lucide React

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                  # Inicia o servidor de desenvolvimento

# Build
pnpm build               # Cria build de produção
pnpm start               # Inicia servidor de produção

# Database
pnpm db:generate         # Gera Prisma Client
pnpm db:push             # Sincroniza schema com o banco
pnpm db:migrate          # Cria e aplica migrations
pnpm db:studio           # Abre Prisma Studio

# Qualidade de Código
pnpm lint                # Executa ESLint
pnpm type-check          # Verifica tipos TypeScript
```

## 🚀 Próximas Etapas de Desenvolvimento

Agora que o projeto está configurado, as próximas fases incluem:

### Fase 3: Seller Profiles (Em progresso)
- Dashboard do vendedor
- Edição de perfil
- Página pública do vendedor

### Fase 4: Product System
- CRUD de produtos
- Upload de imagens
- Categorização

### Fase 5: Browse & Filter
- Catálogo de produtos
- Sistema de busca
- Filtros avançados

### Fase 6: Reviews & Ratings
- Sistema de avaliação
- Comentários

### Fase 7: Optimization
- SEO
- Acessibilidade
- Performance

### Fase 8: Deployment
- Deploy no Vercel
- CI/CD

## 🐛 Solução de Problemas

### Erro: "Cannot find module '@prisma/client'"

```bash
pnpm db:generate
```

### Erro de conexão com PostgreSQL

Verifique se:
- PostgreSQL está rodando: `pg_isready`
- As credenciais no `.env` estão corretas
- O banco de dados existe

### Erro: "NEXTAUTH_SECRET is not set"

Gere um secret seguro:

```bash
openssl rand -base64 32
```

E adicione no `.env`

## 📚 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Dicas de Desenvolvimento

1. **Use TypeScript**: Aproveite o type checking para evitar erros
2. **Componentes Reutilizáveis**: Os componentes em `src/components/ui` são base para outros componentes
3. **Prisma Studio**: Use para visualizar e testar dados rapidamente
4. **Server Actions**: Para forms, considere usar Server Actions do Next.js 14+
5. **Acessibilidade**: Sempre teste com leitores de tela e teclado

## 🤝 Contribuindo

Este é um projeto de grupo. Para contribuir:

1. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
2. Commit suas mudanças: `git commit -m 'Add: descrição da feature'`
3. Push para a branch: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

---

**Dúvidas?** Entre em contato com o time ou abra uma issue no GitHub!

