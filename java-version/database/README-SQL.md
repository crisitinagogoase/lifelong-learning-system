# Ghid SQL - Cum să Folosești Baza de Date

Acest ghid te ajută să înțelegi și să folosești SQL-ul pentru aplicația Learning System.

## Conținut

1. [Cum să Rulezi Scripturile SQL](#cum-să-rulezi-scripturile-sql)
2. [Structura Tabelelor](#structura-tabelelor)
3. [Operații de Bază](#operații-de-bază)
4. [Interogări Utile](#interogări-utile)
5. [Exemple Practice](#exemple-practice)

---

## Cum să Rulezi Scripturile SQL

### Opțiunea 1: Din Linia de Comandă (psql)

```bash
# Conectează-te la PostgreSQL
psql -U postgres

# Creează baza de date
CREATE DATABASE learning_system;

# Ieși din psql
\q

# Rulează schema
psql -U postgres -d learning_system -f schema.sql

# Rulează datele inițiale
psql -U postgres -d learning_system -f initial-data.sql
```

### Opțiunea 2: Din psql Direct

```bash
# Conectează-te la baza de date
psql -U postgres -d learning_system

# Copiază și lipește conținutul din schema.sql
# Apoi copiază și lipește conținutul din initial-data.sql
```

### Opțiunea 3: Din pgAdmin sau Altă Interfață

1. Deschide pgAdmin sau altă interfață grafică
2. Conectează-te la serverul PostgreSQL
3. Creează baza de date `learning_system`
4. Deschide fișierul `schema.sql` și rulează-l
5. Deschide fișierul `initial-data.sql` și rulează-l

---

## Structura Tabelelor

### 1. `users` - Utilizatori

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,              -- ID automat incrementat
    name VARCHAR(255),                  -- Nume utilizator
    email VARCHAR(255) UNIQUE NOT NULL, -- Email (unic, obligatoriu)
    password VARCHAR(255) NOT NULL,     -- Parolă hash-uită
    created_at TIMESTAMP,               -- Data creării
    updated_at TIMESTAMP                -- Data ultimei actualizări
);
```

**Exemplu de inserare:**
```sql
INSERT INTO users (name, email, password) 
VALUES ('Ion Popescu', 'ion@example.com', '$2a$10$hashedpassword');
```

### 2. `user_profiles` - Profil Utilizator

```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- Legătură la users
    bio TEXT,                            -- Biografie
    location VARCHAR(255),                -- Locație
    website VARCHAR(255),                 -- Website
    career_goal VARCHAR(255)             -- Obiectiv carieră
);
```

**Exemplu de inserare:**
```sql
INSERT INTO user_profiles (user_id, bio, career_goal) 
VALUES (1, 'Developer cu 5 ani experiență', 'Senior Software Engineer');
```

### 3. `user_skills` - Competențe Utilizator

```sql
CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skill_name VARCHAR(255) NOT NULL,    -- Nume competență
    skill_level INTEGER DEFAULT 50,      -- Nivel 0-100
    category VARCHAR(100)                -- Categorie
);
```

**Exemplu de inserare:**
```sql
INSERT INTO user_skills (user_id, skill_name, skill_level, category) 
VALUES (1, 'Python', 75, 'programming');
```

### 4. `courses` - Cursuri

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,         -- Titlu curs
    description TEXT,                     -- Descriere
    provider VARCHAR(255),                -- Provider (ex: Udemy)
    level VARCHAR(50),                   -- Nivel (Beginner, Intermediate, etc.)
    duration VARCHAR(50),                 -- Durată (ex: "6 weeks")
    url VARCHAR(500),                    -- Link către curs
    market_relevance DECIMAL(3,2)        -- Relevanță piață (0.00-1.00)
);
```

**Exemplu de inserare:**
```sql
INSERT INTO courses (title, description, provider, level, duration, market_relevance) 
VALUES ('Python Basics', 'Learn Python from scratch', 'Udemy', 'Beginner', '4 weeks', 0.90);
```

### 5. `course_skills` - Competențe Acoperite de Curs

```sql
CREATE TABLE course_skills (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    skill_name VARCHAR(255) NOT NULL
);
```

**Exemplu de inserare:**
```sql
INSERT INTO course_skills (course_id, skill_name) 
VALUES (1, 'Python');
```

### 6. `course_enrollments` - Înscrieri Cursuri

```sql
CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    progress INTEGER DEFAULT 0,          -- Progres 0-100%
    enrolled_at TIMESTAMP,               -- Data înscrierii
    completed_at TIMESTAMP               -- Data completării (NULL dacă nu e completat)
);
```

**Exemplu de inserare:**
```sql
INSERT INTO course_enrollments (user_id, course_id, progress) 
VALUES (1, 1, 25);
```

---

## Operații de Bază

### SELECT - Citire Date

```sql
-- Toți utilizatorii
SELECT * FROM users;

-- Utilizator specific după email
SELECT * FROM users WHERE email = 'ion@example.com';

-- Utilizator cu profil
SELECT u.*, up.bio, up.career_goal 
FROM users u 
LEFT JOIN user_profiles up ON u.id = up.user_id 
WHERE u.id = 1;
```

### INSERT - Adăugare Date

```sql
-- Adaugă utilizator nou
INSERT INTO users (name, email, password) 
VALUES ('Maria Ionescu', 'maria@example.com', 'hashed_password');

-- Adaugă competență utilizator
INSERT INTO user_skills (user_id, skill_name, skill_level) 
VALUES (1, 'JavaScript', 60);
```

### UPDATE - Actualizare Date

```sql
-- Actualizează nume utilizator
UPDATE users 
SET name = 'Ion Popescu Nou' 
WHERE id = 1;

-- Actualizează progres curs
UPDATE course_enrollments 
SET progress = 50 
WHERE user_id = 1 AND course_id = 1;
```

### DELETE - Ștergere Date

```sql
-- Șterge competență utilizator
DELETE FROM user_skills 
WHERE user_id = 1 AND skill_name = 'JavaScript';

-- Șterge utilizator (va șterge automat și profilul și competențele datorită CASCADE)
DELETE FROM users WHERE id = 1;
```

---

## Interogări Utile

### 1. Toate Competențele unui Utilizator

```sql
SELECT skill_name, skill_level, category 
FROM user_skills 
WHERE user_id = 1 
ORDER BY skill_level DESC;
```

### 2. Toate Cursurile Disponibile

```sql
SELECT id, title, provider, level, duration, market_relevance 
FROM courses 
ORDER BY market_relevance DESC;
```

### 3. Cursurile la Care e Înscris un Utilizator

```sql
SELECT c.title, c.provider, ce.progress, ce.enrolled_at 
FROM course_enrollments ce 
JOIN courses c ON ce.course_id = c.id 
WHERE ce.user_id = 1;
```

### 4. Competențele Acoperite de un Curs

```sql
SELECT skill_name 
FROM course_skills 
WHERE course_id = 1;
```

### 5. Recomandări Cursuri pentru un Utilizator

```sql
-- Găsește cursuri care se potrivesc cu competențele utilizatorului
SELECT DISTINCT c.id, c.title, c.description, c.market_relevance
FROM courses c
JOIN course_skills cs ON c.id = cs.course_id
JOIN user_skills us ON cs.skill_name = us.skill_name
WHERE us.user_id = 1
  AND c.id NOT IN (
    SELECT course_id FROM course_enrollments WHERE user_id = 1
  )
ORDER BY c.market_relevance DESC
LIMIT 10;
```

### 6. Cursuri Recomandate Bazate pe Competențe Lipsă

```sql
-- Găsește cursuri care acoperă competențe cu cerere mare pe piață
SELECT c.id, c.title, mt.skill_name, mt.demand, mt.growth_percentage
FROM courses c
JOIN course_skills cs ON c.id = cs.course_id
JOIN market_trends mt ON cs.skill_name = mt.skill_name
WHERE mt.demand = 'high'
  AND cs.skill_name NOT IN (
    SELECT skill_name FROM user_skills WHERE user_id = 1
  )
ORDER BY mt.growth_percentage DESC;
```

### 7. Progres Total Utilizator

```sql
SELECT 
    u.name,
    COUNT(ce.id) as total_enrollments,
    AVG(ce.progress) as avg_progress,
    COUNT(CASE WHEN ce.progress = 100 THEN 1 END) as completed_courses
FROM users u
LEFT JOIN course_enrollments ce ON u.id = ce.user_id
WHERE u.id = 1
GROUP BY u.id, u.name;
```

---

## Exemple Practice

### Exemplu 1: Creează Utilizator Complet

```sql
-- 1. Creează utilizator
INSERT INTO users (name, email, password) 
VALUES ('Alexandru Georgescu', 'alex@example.com', '$2a$10$hashedpassword')
RETURNING id;

-- Notă: ID-ul returnat este, de exemplu, 5

-- 2. Creează profil
INSERT INTO user_profiles (user_id, bio, career_goal) 
VALUES (5, 'Software Developer', 'Senior Full Stack Developer');

-- 3. Adaugă competențe
INSERT INTO user_skills (user_id, skill_name, skill_level, category) VALUES
(5, 'Python', 70, 'programming'),
(5, 'JavaScript', 65, 'programming'),
(5, 'React', 60, 'frontend'),
(5, 'SQL', 75, 'database');
```

### Exemplu 2: Înscrie Utilizator la Curs

```sql
-- Găsește ID-ul cursului
SELECT id FROM courses WHERE title = 'Python for Data Science';

-- Înscrie utilizator (presupunem că cursul are ID 15)
INSERT INTO course_enrollments (user_id, course_id, progress) 
VALUES (5, 15, 0);
```

### Exemplu 3: Actualizează Progres Curs

```sql
UPDATE course_enrollments 
SET progress = 50 
WHERE user_id = 5 AND course_id = 15;

-- Marchează ca completat când progresul ajunge la 100%
UPDATE course_enrollments 
SET progress = 100, completed_at = CURRENT_TIMESTAMP 
WHERE user_id = 5 AND course_id = 15 AND progress >= 100;
```

### Exemplu 4: Adaugă Curs Nou

```sql
-- 1. Adaugă cursul
INSERT INTO courses (title, description, provider, level, duration, market_relevance) 
VALUES ('Spring Boot Fundamentals', 'Learn Spring Boot for Java development', 'Udemy', 'Intermediate', '6 weeks', 0.88)
RETURNING id;

-- 2. Adaugă competențele acoperite (presupunem că cursul are ID 21)
INSERT INTO course_skills (course_id, skill_name) VALUES
(21, 'Java'),
(21, 'Spring Boot'),
(21, 'Backend Development');

-- 3. Adaugă prerequisite-uri
INSERT INTO course_prerequisites (course_id, prerequisite_skill) VALUES
(21, 'Java');
```

### Exemplu 5: Verifică Datele

```sql
-- Verifică toți utilizatorii
SELECT id, name, email, created_at FROM users;

-- Verifică toate cursurile
SELECT id, title, provider, level FROM courses;

-- Verifică competențele utilizatorului
SELECT skill_name, skill_level FROM user_skills WHERE user_id = 1;

-- Verifică înscrierile
SELECT u.name, c.title, ce.progress 
FROM course_enrollments ce
JOIN users u ON ce.user_id = u.id
JOIN courses c ON ce.course_id = c.id;
```

---

## Sfaturi și Best Practices

1. **Folosește TRANSACTIONS pentru operații multiple:**
```sql
BEGIN;
INSERT INTO users (name, email, password) VALUES (...);
INSERT INTO user_profiles (user_id, ...) VALUES (...);
COMMIT;
```

2. **Folosește WHERE pentru a evita actualizări accidentale:**
```sql
-- BINE
UPDATE users SET name = 'Nou' WHERE id = 1;

-- RĂU (va actualiza TOȚI utilizatorii!)
UPDATE users SET name = 'Nou';
```

3. **Folosește JOIN pentru a combina date din mai multe tabele:**
```sql
SELECT u.name, c.title 
FROM users u
JOIN course_enrollments ce ON u.id = ce.user_id
JOIN courses c ON ce.course_id = c.id;
```

4. **Folosește INDEX-uri pentru performanță:**
Index-urile sunt deja create în `schema.sql`, dar poți adăuga altele:
```sql
CREATE INDEX idx_user_skills_skill_name ON user_skills(skill_name);
```

---

## Probleme Comune și Soluții

### Eroare: "duplicate key value violates unique constraint"
**Cauză:** Încerci să adaugi o valoare duplicată într-un câmp UNIQUE.
**Soluție:** Verifică dacă valoarea există deja:
```sql
SELECT * FROM users WHERE email = 'ion@example.com';
```

### Eroare: "foreign key constraint fails"
**Cauză:** Încerci să adaugi o referință la un ID care nu există.
**Soluție:** Verifică că ID-ul există:
```sql
SELECT id FROM users WHERE id = 999; -- Verifică dacă există
```

### Eroare: "column does not exist"
**Cauză:** Ai scris greșit numele coloanei.
**Soluție:** Verifică numele corect:
```sql
\d users  -- În psql, arată structura tabelului
```

---

## Resurse Suplimentare

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

**Notă:** Toate exemplele din acest ghid presupun că ai rulat deja `schema.sql` și `initial-data.sql`.
