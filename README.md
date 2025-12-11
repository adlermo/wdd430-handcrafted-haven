# 🌿 Handcrafted Haven

> A modern, accessible marketplace connecting talented artisans with customers who appreciate unique handmade products.

Handcrafted Haven is a web application created for the WDD430 group project.
It serves as a small marketplace where artisans can create profiles, list handcrafted items, and connect with users who appreciate handmade products.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)](https://www.prisma.io/)

---

## 📖 Quick Links

| Category | Link | Description |
|----------|------|-------------|
| 📚 **Getting Started** | [GETTING_STARTED.md](GETTING_STARTED.md) | Initial configurations and project overview |

---

## ✨ Features

### **Core Functionality**
- 🎨 **Seller Profiles** - Artisans can showcase their craftsmanship with dedicated profiles
- 🛍️ **Product Management** - Complete CRUD for products with multi-image upload
- ⭐ **Reviews & Ratings** - User feedback system with star ratings and comments
- 🔍 **Advanced Search** - Real-time search with category and price filters
- 📱 **Responsive Design** - Mobile-first approach, optimized for all devices
- ♿ **WCAG 2.1 AA Compliant** - Fully accessible with skip links, ARIA labels, and keyboard navigation

### **User Experience**
- 🔐 Secure authentication with NextAuth.js v5
- 🎭 Role-based access (Buyer, Seller, Admin)
- 💼 Seller Dashboard with real-time stats
- 🖼️ Image optimization with next/image
- ⚡ Lightning-fast page loads
- 🎨 Beautiful custom design system (Terracotta, Cream, Sage, Charcoal, Wine)

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5.9, Tailwind CSS 3.4 |
| **Backend** | Next.js API Routes, Prisma ORM 6.19 |
| **Database** | PostgreSQL (Vercel Postgres) |
| **Auth** | NextAuth.js v5 |
| **Storage** | Vercel Blob Storage (planned) |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Fonts** | Arvo (Display) + Inter (Sans) |
| **Deployment** | Vercel |
| **Management** | GitHub Projects |

### **Key Dependencies**
```json
{
  "next": "^15.5.7",
  "react": "^19.2.1",
  "typescript": "^5.9.3",
  "tailwindcss": "^3.4.19",
  "@prisma/client": "6.19.0",
  "next-auth": "^5.0.0-beta.25",
  "zod": "^3.24.1",
  "lucide-react": "^0.460.0"
}
```


## 🚀 Getting Started

### **Prerequisites**

- Node.js 18.x or higher
- PostgreSQL database (or Vercel Postgres)
- pnpm (recommended) or npm

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/adlermo/wdd430-handcrafted-haven.git
cd handcrafted-haven
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

4. **Generate Prisma Client:**
```bash
pnpm prisma generate
```

5. **Push database schema:**
```bash
pnpm prisma db push
```

6. **Start the development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Detailed Setup**

For complete setup instructions, including:
- Database configuration (Neon, Vercel Postgres)
- Environment variables
- Troubleshooting
- Development workflow

See **[GETTING_STARTED.md](GETTING_STARTED.md)**

## 📂 Project Structure
```
/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (auth)/                   # Authentication routes (login, register)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/                   # Main application routes
│   │   │   ├── products/             # Product listing & details
│   │   │   ├── sellers/              # Seller profiles (public)
│   │   │   ├── profile/              # User profile management
│   │   │   ├── about/                # About page
│   │   │   └── layout.tsx
│   │   ├── (seller)/                 # Seller-only routes
│   │   │   └── seller/
│   │   │       ├── dashboard/        # Seller dashboard
│   │   │       ├── products/         # Product management
│   │   │       └── profile/          # Seller profile edit
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # NextAuth.js
│   │   │   ├── seller/               # Seller APIs
│   │   │   ├── user/                 # User APIs
│   │   │   └── products/             # Public product APIs
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/                   # React components
│   │   ├── layout/                   # Header, Footer
│   │   ├── ui/                       # Reusable UI (Button, Input, Card)
│   │   ├── reviews/                  # Review system
│   │   ├── seller/                   # Seller-specific components
│   │   └── providers.tsx             # Context providers
│   │
│   ├── lib/                          # Utilities and configs
│   │   ├── auth.config.ts            # NextAuth configuration
│   │   ├── auth.ts                   # BCrypt and Zod configuration
│   │   ├── prisma.ts                 # Prisma client
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Shared types
│   │   └── next-auth.d.ts            # NextAuth augmentation
│   │
│   └── middleware.ts                 # Route protection
│
├── prisma/
│   └── schema.prisma                 # Database schema (5 models)
│
├── public/                           # Static assets
│   ├── carving-knife-logo.png        # Custom logo
│   ├── favicon.ico                   # Favicon
│   ├── favicon.svg                   # SVG favicon
│   └── site.webmanifest              # PWA manifest
│
├── 📚 Documentation/                 # 3 comprehensive docs
│   ├── DOCUMENTATION_INDEX.md        # Navigation hub
│   └── GETTING_STARTED.md            # Complete setup
│
├── tailwind.config.ts                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies

```

## 📚 Documentation

We have **a detailed documentation file** to help you navigate and understand the project:

### **Essential Docs (Start Here)**
1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete setup guide


---

## 🚀 Quick Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Run Prisma Studio
pnpm prisma studio

# Generate Prisma Client
pnpm prisma generate

# Push database schema
pnpm prisma db push
```

---

## 🤝 Contributing

This is a group project for WDD430 at BYU-Idaho.

**Team Members:**
- Adler Mesquita Orteney

---

## 📝 License

This project is created for educational purposes at BYU-Idaho.

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live Site** | [Coming Soon - Vercel] |
| **Repository** | [https://github.com/adlermo/wdd430-handcrafted-haven](https://github.com/adlermo/wdd430-handcrafted-haven) |
| **Project Board** | [GitHub Projects](https://github.com/adlermo/wdd430-handcrafted-haven/projects) |

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices:
- Next.js 15 Team for the amazing framework
- Vercel for hosting and infrastructure
- Prisma team for the excellent ORM
- NextAuth.js for authentication
- Tailwind CSS for styling utilities
- BYU-Idaho for the educational opportunity

---

## 📞 Support

**Need help?**

1. See **[GETTING_STARTED.md](GETTING_STARTED.md)** for setup issues
2. Create a GitHub issue for bugs or features

---

**Last Updated:** December 11, 2025 | **Version:** 1.0.0 | **Status:** ✅ MVP Complete

---

**[⬆ Back to top](#-handcrafted-haven)**