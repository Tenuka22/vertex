# Vertex

A modern business management platform built with TypeScript, consolidated into a single Next.js application, featuring comprehensive business profile management, financial tracking, and location management capabilities.

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), leveraging cutting-edge technologies for type safety, performance, and developer experience.

## Features

### Core Technologies
- **TypeScript** - Full type safety across the entire stack
- **Next.js 15** - React framework with App Router, Turbopack, and Server Actions for all server-side logic
- **TailwindCSS** - Utility-first CSS with custom animations
- **Radix UI** - Accessible, unstyled UI components
- **Drizzle ORM** - TypeScript-first database toolkit
- **PostgreSQL** - Robust relational database
- **Better Auth** - Modern authentication with email/password and Google OAuth

### Business Management Features
- **Business Profiles** - Complete company information management
- **Multi-location Support** - Manage multiple business locations with geographic data
- **Financial Tracking** - Comprehensive expense, budget, and cash flow management
- **Transaction Management** - Track income, expenses, and payment methods
- **User Authentication** - Secure login with email/password and Google OAuth
- **Real-time Updates** - Live data synchronization across all components

### Developer Experience
- **Monorepo Architecture** - Organized workspace with Turbo for build optimization
- **Code Quality** - Biome for lightning-fast linting and formatting with Ultracite rules
- **Type Safety** - End-to-end TypeScript with strict configuration
- **Git Hooks** - Automated code quality checks with Husky
- **Hot Reload** - Fast development with Turbopack

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (v1.2.18+)
- [Node.js](https://nodejs.org/) (v18+)
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd vertex
bun install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in `apps/web/`
   - Configure your database connection and authentication secrets

3. Start the development server:
```bash
bun dev
```

The web application will be available at [http://localhost:3001](http://localhost:3001).

## Project Structure

```
vertex/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/
│       │   ├── app/         # App Router pages and layouts
│       │   │   └── actions/   # Next.js Server Actions
│       │   ├── components/  # React components
│       │   └── lib/         # Client utilities and configurations
│       └── package.json
├── packages/
│   └── db/                  # Database schema and utilities
│       └── src/
│           └── schema/      # Drizzle schema definitions
├── biome.json              # Code formatting and linting rules
├── turbo.json              # Monorepo build configuration
└── package.json            # Root workspace configuration
```

## Database Schema

The application uses a robust PostgreSQL schema with the following main entities:

- **Business Profiles** - Core company information
- **Business Locations** - Multiple locations per business
- **Business Information** - Extended business details
- **Financial Data** - Budgets, expenses, transactions, and cash flows
- **User Management** - Authentication and user profiles
- **Payment Methods** - Various payment options and details

## Available Scripts

### Development
- `bun dev` - Start the web application in development mode
- `bun dev:web` - Start only the web application

### Build & Deploy
- `bun build` - Build all applications for production
- `bun check-types` - Type check across all packages

### Code Quality
- `bun check` - Run Biome linting and formatting
- Git hooks automatically run quality checks on commit

## Deployment

The application is a Next.js application and can be deployed on platforms like Vercel, Netlify, or self-hosted environments.

Run `bun build` to prepare for production deployment.