# Lifelong Learning System

A comprehensive platform for continuous career development, featuring CV analysis, skill assessment, personalized learning recommendations, and career path guidance.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** (package manager)
- **PostgreSQL** (database)
- **Git** (version control)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lifelong-learning-system
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lifelong_learning?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Node Environment
NODE_ENV="development"
```

**Important Notes:**
- Replace `username`, `password`, and `lifelong_learning` with your actual PostgreSQL credentials and database name
- Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
  ```bash
  openssl rand -base64 32
  ```
- For production, use a secure, randomly generated secret

### 4. Set Up the Database

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE lifelong_learning;

# Exit psql
\q
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Start the Development Server

```bash
npm run dev
```

Or using pnpm:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply new database migrations
- `npx prisma generate` - Regenerate Prisma Client after schema changes

## Project Structure

```
lifelong-learning-system/
├── app/                    # Next.js app directory (pages and API routes)
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── learning/          # Learning pages
│   ├── profile/           # User profile page
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── ...
├── lib/                   # Utility libraries and services
│   ├── api/              # API service clients
│   ├── services/         # Business logic services
│   └── prisma.ts         # Prisma client instance
├── prisma/               # Database schema and migrations
│   └── schema.prisma    # Prisma schema definition
├── public/               # Static assets
└── hooks/               # Custom React hooks
```

## Key Dependencies

### Core Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Database & ORM
- **Prisma 6.8.2** - Database ORM
- **PostgreSQL** - Database

### Authentication
- **NextAuth 4.24.11** - Authentication library
- **bcryptjs** - Password hashing

### UI Components
- **Radix UI** - Headless UI components
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### File Processing
- **mammoth** - DOCX file parsing
- **pdf-parse** - PDF file parsing
- **pdf-lib** - PDF manipulation

### Forms & Validation
- **react-hook-form** - Form management
- **zod** - Schema validation

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check your `DATABASE_URL` in `.env` matches your PostgreSQL configuration

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or specify a different port
PORT=3001 npm run dev
```

### Prisma Client Issues

If you see Prisma Client errors:

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: This deletes all data)
npx prisma migrate reset
```

### Module Not Found Errors

If you encounter module not found errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Notes

- The project uses Next.js App Router (not Pages Router)
- All API routes are in `app/api/`
- Client components must have `'use client'` directive
- Prisma Client is generated to `lib/generated/prisma/`
- The project uses TypeScript strict mode

## Production Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NODE_ENV=production`

### Database Migrations in Production

```bash
npx prisma migrate deploy
```

## Support

For issues or questions, please refer to:
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth Documentation: https://next-auth.js.org
