# Architecture Documentation

This document explains the codebase structure, file relationships, data flow, and how different parts of the application interact.

## Overview

The Lifelong Learning System is built with Next.js 15 using the App Router, React 19, TypeScript, Prisma ORM, and PostgreSQL. It follows a layered architecture with clear separation between UI components, business logic, and data access.

## Architecture Layers

### 1. Presentation Layer (UI Components)
**Location:** `app/` and `components/`

- **Pages** (`app/*/page.tsx`): Next.js route pages that render UI
- **Components** (`components/`): Reusable React components
- **UI Components** (`components/ui/`): shadcn/ui component library

### 2. API Layer
**Location:** `app/api/`

- **Route Handlers** (`app/api/*/route.ts`): Next.js API route handlers
- Handle HTTP requests, validate input, call services, return responses

### 3. Business Logic Layer
**Location:** `lib/services/` and `lib/api/`

- **Services** (`lib/services/*.ts`): Core business logic and data processing
- **API Services** (`lib/api/*.ts`): External API integrations and data fetching

### 4. Data Access Layer
**Location:** `lib/prisma.ts` and `prisma/`

- **Prisma Client** (`lib/prisma.ts`): Database client instance
- **Schema** (`prisma/schema.prisma`): Database schema definition

## File Relationships and Data Flow

### Authentication Flow

```
User Login Request
  ↓
app/login/page.tsx (Client Component)
  ↓ (calls signIn from next-auth/react)
app/api/auth/[...nextauth]/route.ts
  ↓ (validates credentials)
lib/prisma.ts → PostgreSQL
  ↓ (returns user data)
NextAuth Session Provider
  ↓ (provides session to app)
app/providers.tsx (SessionProvider)
  ↓
app/layout.tsx (Root Layout)
```

**Key Files:**
- `app/login/page.tsx`: Login UI and form handling
- `app/api/auth/[...nextauth]/route.ts`: NextAuth configuration and credential validation
- `app/providers.tsx`: Wraps app with SessionProvider
- `lib/prisma.ts`: Database client for user lookup

### User Registration Flow

```
Registration Form
  ↓
app/register/page.tsx
  ↓ (POST request)
app/api/register/route.ts
  ↓ (validates input, hashes password)
lib/prisma.ts → PostgreSQL (creates user)
  ↓ (returns success)
app/register/page.tsx (shows success, redirects)
```

**Key Files:**
- `app/register/page.tsx`: Registration form UI
- `app/api/register/route.ts`: Handles user creation, password hashing with bcryptjs

### CV Analysis Flow

```
User Uploads CV
  ↓
components/skill-assessment/cv-upload-analyzer.tsx
  ↓ (FormData with file)
app/api/cv-analysis/route.ts
  ↓ (extracts file buffer)
lib/services/cv-analysis-service.ts
  ↓ (extracts text from PDF/DOCX)
  ↓ (parses skills, experiences, education)
  ↓ (generates recommendations)
  ↓ (returns structured data)
app/api/cv-analysis/route.ts
  ↓ (returns JSON response)
components/skill-assessment/cv-upload-analyzer.tsx
  ↓ (displays results)
components/skill-assessment/recommendations-display.tsx
```

**Key Files:**
- `app/api/cv-analysis/route.ts`: API endpoint for CV upload
- `lib/services/cv-analysis-service.ts`: Core CV parsing logic
  - `extractDataFromCV()`: Extracts text from PDF/DOCX files
  - `extractSkills()`: Parses skills from text using keyword matching
  - `extractExperiences()`: Extracts work experience
  - `generateRecommendations()`: Creates course and career recommendations

**Dependencies:**
- `mammoth`: DOCX file parsing
- `pdf-parse`: PDF text extraction
- `pdf-lib`: PDF manipulation utilities

### Profile Management Flow

```
Profile Page Load
  ↓
app/profile/page.tsx
  ↓ (GET request)
app/api/profile/route.ts
  ↓ (gets session)
lib/services/profile-service.ts
  ↓ (queries database)
lib/prisma.ts → PostgreSQL
  ↓ (returns profile data)
app/profile/page.tsx (displays data)

Profile Update
  ↓
app/profile/page.tsx (form submission)
  ↓ (PUT request)
app/api/profile/route.ts
  ↓ (validates session)
lib/services/profile-service.ts
  ↓ (updates database)
lib/prisma.ts → PostgreSQL
  ↓ (returns updated profile)
app/profile/page.tsx (updates UI)
```

**Key Files:**
- `app/profile/page.tsx`: Profile UI with tabs for personal info, skills, career goals
- `app/api/profile/route.ts`: GET and PUT handlers for profile operations
- `lib/services/profile-service.ts`: Profile data access and business logic

### Dashboard Flow

```
User Accesses Dashboard
  ↓
app/dashboard/page.tsx
  ↓ (checks authentication)
  ↓ (loads from localStorage)
  ↓ (displays career paths, courses, skills)
components/dashboard-header.tsx
components/learning-path-recommendation.tsx
```

**Key Files:**
- `app/dashboard/page.tsx`: Main dashboard with career selection, enrolled courses
- `components/dashboard-header.tsx`: Header with navigation
- `components/learning-path-recommendation.tsx`: Displays recommended learning paths

**Data Storage:**
- Uses `localStorage` for client-side persistence (career selection, enrolled courses)
- Session data from NextAuth for user information

### Learning/Course Flow

```
User Selects Course
  ↓
app/learning/page.tsx (course list)
  ↓ (navigates to course)
app/learning/[courseId]/page.tsx
  ↓ (loads course content from static object)
  ↓ (tracks progress in localStorage)
  ↓ (displays modules and lessons)
```

**Key Files:**
- `app/learning/page.tsx`: Course listing page
- `app/learning/[courseId]/page.tsx`: Individual course page with dynamic routing
- Course content is currently stored in static objects within the page component

**Note:** Course progress is stored in `localStorage` with key `course-${courseId}-progress`

## Database Schema

### Models (from `prisma/schema.prisma`)

**User Model:**
- `id`: Primary key
- `email`: Unique email address
- `name`: User's name
- `password`: Hashed password (bcrypt)
- `image`: Profile image URL
- Relations: `accounts[]`, `sessions[]`

**Account Model:**
- OAuth account information (for future OAuth integration)
- Linked to User via `userId`

**Session Model:**
- NextAuth session tokens
- Linked to User via `userId`

**VerificationToken Model:**
- Email verification tokens

## Service Layer Details

### CV Analysis Service (`lib/services/cv-analysis-service.ts`)

**Responsibilities:**
- File parsing (PDF, DOCX)
- Text extraction and analysis
- Skill detection using keyword matching
- Experience extraction using regex patterns
- Course recommendation algorithm
- Career path matching

**Key Methods:**
- `extractDataFromCV()`: Main entry point for CV processing
- `extractSkills()`: Detects technical skills from text
- `generateRecommendations()`: Creates personalized course and career recommendations
- `generateCareerPaths()`: Matches user skills to job titles

**Data Structures:**
- `MARKET_TRENDS`: Market demand data for skills
- `COURSES`: Static course database
- `SKILL_SYNONYMS`: Maps related skills together
- `JOB_TITLES`: Maps job titles to required skills

### Profile Service (`lib/services/profile-service.ts`)

**Responsibilities:**
- User profile CRUD operations
- Skill management
- Career goal storage

**Key Methods:**
- `getUserProfile()`: Retrieves user profile
- `updateUserProfile()`: Updates profile data

## API Routes

### Authentication Routes
- `app/api/auth/[...nextauth]/route.ts`: NextAuth catch-all route
  - Handles: GET (session), POST (login)

### User Routes
- `app/api/register/route.ts`: User registration
  - Method: POST
  - Body: `{ email, password, name }`
  - Returns: User object (without password)

### Profile Routes
- `app/api/profile/route.ts`: Profile management
  - GET: Retrieves user profile
  - PUT: Updates user profile
  - Requires: Authenticated session

### CV Analysis Routes
- `app/api/cv-analysis/route.ts`: CV upload and analysis
  - Method: POST
  - Body: FormData with file
  - Returns: `{ cvData, recommendations }`

## Component Hierarchy

### Root Layout
```
app/layout.tsx
  ├── ThemeProvider (dark/light mode)
  └── Providers (SessionProvider)
      └── {children} (all pages)
```

### Page Components
- `app/page.tsx`: Landing/home page
- `app/login/page.tsx`: Login page
- `app/register/page.tsx`: Registration page
- `app/dashboard/page.tsx`: Main dashboard
- `app/profile/page.tsx`: User profile management
- `app/learning/page.tsx`: Course listing
- `app/learning/[courseId]/page.tsx`: Individual course
- `app/assessment/page.tsx`: Skill assessment
- `app/certifications/page.tsx`: Certifications
- `app/market-trends/page.tsx`: Market trends

### Reusable Components
- `components/ui/*`: shadcn/ui components (Button, Card, Dialog, etc.)
- `components/skill-assessment/*`: CV upload, skill forms, recommendations
- `components/certification/*`: Certification display and verification
- `components/market-analysis/*`: Job market trends visualization

## Data Fetching Patterns

### Client-Side Fetching
Pages use `useEffect` hooks to fetch data on mount:
```typescript
useEffect(() => {
  fetch('/api/profile')
    .then(res => res.json())
    .then(data => setProfile(data))
}, [])
```

### Server-Side Authentication
API routes use `getServerSession()` to verify authentication:
```typescript
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### File Upload
CV upload uses FormData:
```typescript
const formData = new FormData()
formData.append('file', file)
fetch('/api/cv-analysis', { method: 'POST', body: formData })
```

## State Management

### Client State
- React `useState` hooks for component-level state
- `localStorage` for persistent client-side data (course progress, career selection)
- NextAuth session for user authentication state

### Server State
- Prisma queries for database state
- No global state management library (Redux, Zustand) currently used

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: Secret for JWT signing
- `NODE_ENV`: Environment (development/production)

## Type Safety

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to project root
- Type definitions in `types/` directory

### Key Type Definitions
- User types from Prisma schema
- Custom types in service files (e.g., `CVAnalysisResult`, `Skill`, `Experience`)

## Security Considerations

### Authentication
- Passwords hashed with bcryptjs (10 rounds)
- JWT sessions via NextAuth
- Session cookies with httpOnly flag

### API Security
- Session validation on protected routes
- Input validation in API handlers
- File type validation for uploads

## Future Architecture Considerations

### Potential Improvements
1. **Database Models**: Add models for courses, enrollments, progress tracking
2. **API Services**: Move external API calls to dedicated service layer
3. **State Management**: Consider Zustand or React Query for complex state
4. **Caching**: Implement caching for course data and recommendations
5. **File Storage**: Move file uploads to cloud storage (S3, Cloudinary)
6. **Real-time Updates**: Add WebSocket support for live progress updates

## Dependencies Overview

### Core
- Next.js: Framework and routing
- React: UI library
- TypeScript: Type safety

### Database
- Prisma: ORM and database client
- PostgreSQL: Database

### Authentication
- NextAuth: Authentication framework
- bcryptjs: Password hashing

### UI
- Tailwind CSS: Styling
- Radix UI: Headless components
- shadcn/ui: Component library

### File Processing
- mammoth: DOCX parsing
- pdf-parse: PDF text extraction

### Forms
- react-hook-form: Form management
- zod: Schema validation
