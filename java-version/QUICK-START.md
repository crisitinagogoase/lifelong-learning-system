# Quick Start - Setup Rapid

## Instalare Rapidă PostgreSQL (macOS)

```bash
# 1. Instalează PostgreSQL
brew install postgresql@16

# 2. Pornește serviciul
brew services start postgresql@16

# 3. Creează baza de date
createdb learning_system

# 4. Rulează scripturile SQL
psql -d learning_system -f database/schema.sql
psql -d learning_system -f database/initial-data.sql

# 5. Verifică
psql -d learning_system -c "SELECT COUNT(*) FROM courses;"
```

## Configurare Aplicație Java

Editează `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_system
spring.datasource.username=$(whoami)  # Sau 'postgres' dacă ai creat utilizatorul
spring.datasource.password=
```

## Rulează Aplicația

```bash
mvn spring-boot:run
```

Aplicația va rula pe: `http://localhost:8080`

## Test API

```bash
# Înregistrare utilizator
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Listă cursuri
curl http://localhost:8080/api/courses
```

## Dacă PostgreSQL nu este instalat

Vezi `INSTALL-POSTGRESQL.md` pentru instrucțiuni detaliate.
