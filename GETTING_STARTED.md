# 🚀 Quick Start Guide - Handcrafted Haven

This guide will help you set up the project locally and start developing.

## 📋 Prerequisites

Before starting, make sure you have installed:

* **Node.js** 18.x or higher ([Download](https://nodejs.org/))
* **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
* **pnpm** (recommended) or npm

  ```bash
  npm install -g pnpm
  ```

## 🎯 Initialization Steps

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Set Up the Database

#### a) Create the PostgreSQL database

```bash
# Access PostgreSQL
psql postgres

# Create the database
CREATE DATABASE handcrafted_haven;

# Create a user (optional)
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE handcrafted_haven TO your_user;

# Exit psql
\q
```

#### b) Configure environment variables

Copy the example file and set your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
# Database
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/handcrafted_haven?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key-here" # Generate with: openssl rand -base64 32

# Vercel Blob Storage (optional for local development)
BLOB_READ_WRITE_TOKEN=""
```

### 3. Run Prisma Migrations

```bash
# Generate Prisma Client
pnpm db:generate

# Create tables in the database
pnpm db:push

# Or use migrations for production environments
pnpm db:migrate
```

### 4. (Optional) Visualize the Database

Prisma Studio is a visual interface for your database:

```bash
pnpm db:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit data.

### 5. Start the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the System

### Create your first account

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill out the registration form
3. Choose between “Buyer” or “Seller”
4. Log in at [http://localhost:3000/login](http://localhost:3000/login)

### User Roles

* **BUYER**: Users who browse and purchase products
* **SELLER**: Artisans who sell products (with access to the seller dashboard)

---

## 📁 Project Structure

```
handcrafted-haven/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth routes (login, register)
│   │   ├── api/                 # API Routes
│   │   │   └── auth/            # Authentication endpoints
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── ui/                  # UI components (Button, Input, etc.)
│   │   └── layout/              # Layout components (Header, Footer)
│   ├── lib/                     # Utilities and configs
│   │   ├── auth.config.ts       # NextAuth configuration
│   │   ├── auth.ts              # BCrypt and Zod configuration
│   │   ├── prisma.ts            # Prisma client
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript definitions
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static files
└── package.json
```

---

## 🎨 Tech Stack

* **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS
* **Database**: PostgreSQL + Prisma ORM
* **Authentication**: NextAuth.js v5
* **Validation**: Zod
* **Icons**: Lucide React

---

## 🔧 Available Scripts

```bash
# Development
pnpm dev                  # Starts dev server

# Build
pnpm build               # Creates production build
pnpm start               # Starts production server

# Database
pnpm db:generate         # Generates Prisma Client
pnpm db:push             # Syncs schema to DB
pnpm db:migrate          # Creates/applies migrations
pnpm db:studio           # Opens Prisma Studio

# Code Quality
pnpm lint                # Runs ESLint
pnpm type-check          # Runs TypeScript checks
```

---

## 🚀 Next Development Steps

Now that the project is set up, upcoming phases include:

### Phase 3: Seller Profiles (In progress)

* Seller dashboard
* Profile editing
* Public seller page

### Phase 4: Product System

* Product CRUD
* Image upload
* Categorization

### Phase 5: Browse & Filter

* Product catalog
* Search system
* Advanced filters

### Phase 6: Reviews & Ratings

* Review system
* Comments

### Phase 7: Optimization

* SEO
* Accessibility
* Performance

### Phase 8: Deployment

* Deploy to Vercel
* CI/CD setup

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
pnpm db:generate
```

### PostgreSQL connection errors

Check if:

* PostgreSQL is running: `pg_isready`
* Credentials in `.env` are correct
* The database exists

### Error: "NEXTAUTH_SECRET is not set"

Generate a secure secret:

```bash
openssl rand -base64 32
```

Add it to `.env`

---

## 📚 Useful Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [Prisma Documentation](https://www.prisma.io/docs)
* [NextAuth.js Documentation](https://next-auth.js.org/)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Development Tips

1. **Use TypeScript** to avoid common bugs
2. **Reusability**: Components in `src/components/ui` are base building blocks
3. **Prisma Studio** helps you inspect and test data quickly
4. **Server Actions**: Consider them for forms in Next.js 14+
5. **Accessibility**: Always test with screen readers and keyboard navigation

---

## 🤝 Contributing

This is a group project. To contribute:

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add: feature description'`
3. Push the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

---

**Questions?** Contact the team or open an issue on GitHub!
