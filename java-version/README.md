# Lifelong Learning System - Versiune Java Simplificată

Această versiune simplificată folosește Java cu Spring Boot și SQL direct (fără ORM complex).

## Structura Proiectului

```
java-version/
├── database/
│   ├── schema.sql          # Schema bazei de date
│   ├── initial-data.sql    # Date inițiale (cursuri, etc.)
│   └── README-SQL.md       # Ghid detaliat pentru SQL
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── learning/
│       │           ├── LearningApplication.java
│       │           ├── controller/
│       │           ├── service/
│       │           ├── model/
│       │           └── repository/
│       └── resources/
│           ├── application.properties
│           └── application.yml
├── pom.xml                 # Dependencies Maven
└── README.md               # Acest fișier
```

## Cerințe

- Java 17 sau mai nou
- Maven 3.6+
- PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, sau VS Code)

## Instalare Rapidă

### 1. Creează Baza de Date

```bash
# Conectează-te la PostgreSQL
psql -U postgres

# Creează baza de date
CREATE DATABASE learning_system;

# Ieși
\q
```

### 2. Rulează Scripturile SQL

```bash
# Rulează schema
psql -U postgres -d learning_system -f database/schema.sql

# Adaugă date inițiale
psql -U postgres -d learning_system -f database/initial-data.sql
```

### 3. Configurează Aplicația

Editează `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_system
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
```

### 4. Rulează Aplicația

```bash
mvn spring-boot:run
```

Aplicația va rula pe `http://localhost:8080`

## API Endpoints

- `POST /api/auth/register` - Înregistrare utilizator
- `POST /api/auth/login` - Autentificare
- `GET /api/users/profile` - Profil utilizator
- `PUT /api/users/profile` - Actualizare profil
- `GET /api/courses` - Listă cursuri
- `GET /api/courses/{id}` - Detalii curs
- `GET /api/recommendations` - Recomandări personalizate

## Ghid SQL

Vezi `database/README-SQL.md` pentru instrucțiuni detaliate despre cum să folosești SQL-ul.
