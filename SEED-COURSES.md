# Seed Courses Data

To populate the database with initial course data, run:

```bash
psql $DATABASE_URL -f prisma/seed-courses.sql
```

Or if you need to specify the database connection manually:

```bash
psql -h localhost -U your_username -d your_database -f prisma/seed-courses.sql
```

This will add:
- 20 courses
- Course skills for each course
- Prerequisites for courses

**Note:** This script uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times - it won't create duplicates.
