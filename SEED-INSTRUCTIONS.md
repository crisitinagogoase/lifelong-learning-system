# Seed Database Instructions

## Populate Courses in Database

To add initial course data to your database, run:

```bash
npm run db:seed
```

Or directly with tsx:

```bash
npx tsx prisma/seed.ts
```

This will:
- Add 20 courses to the database
- Add course skills for each course
- Add prerequisites for courses
- Skip courses that already exist (safe to run multiple times)

## What Gets Added

- **20 Courses** covering various topics:
  - Data Science & Machine Learning
  - Web Development (Full Stack, React, JavaScript)
  - Cloud Computing (AWS, Azure)
  - DevOps & CI/CD
  - Project Management
  - And more...

- **Course Skills** - Each course has associated skills
- **Prerequisites** - Some courses have prerequisite skills

## Notes

- The script uses Prisma Client to insert data
- It checks for existing courses before inserting (no duplicates)
- Safe to run multiple times
- Requires database connection via `DATABASE_URL` in `.env`
