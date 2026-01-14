# Instalare PostgreSQL pe macOS

## Opțiunea 1: Instalare cu Homebrew (Recomandat)

### Pasul 1: Instalează PostgreSQL

```bash
brew install postgresql@16
```

Sau pentru ultima versiune:
```bash
brew install postgresql
```

### Pasul 2: Pornește PostgreSQL

```bash
# Pornește serviciul PostgreSQL
brew services start postgresql@16

# SAU pentru versiunea standard
brew services start postgresql
```

### Pasul 3: Verifică Instalarea

```bash
# Verifică dacă PostgreSQL rulează
psql --version

# Sau
which psql
```

### Pasul 4: Configurează PostgreSQL

```bash
# Conectează-te la PostgreSQL (utilizator implicit: postgres)
psql postgres

# Dacă nu funcționează, încearcă cu utilizatorul tău macOS:
psql -d postgres
```

## Opțiunea 2: Instalare cu Postgres.app (Interfață Grafică)

1. Descarcă de la: https://postgresapp.com/
2. Instalează aplicația
3. Pornește Postgres.app din Applications
4. Click pe "Initialize" pentru a crea un server nou
5. Adaugă la PATH:

```bash
# Adaugă la ~/.zshrc sau ~/.bash_profile
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"

# Reîncarcă shell-ul
source ~/.zshrc
```

## Opțiunea 3: Instalare cu Docker (Dacă ai Docker)

```bash
# Rulează PostgreSQL în Docker
docker run --name postgres-learning \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=learning_system \
  -p 5432:5432 \
  -d postgres:16

# Conectează-te
docker exec -it postgres-learning psql -U postgres -d learning_system
```

## După Instalare: Configurează Baza de Date

### 1. Creează Baza de Date

```bash
# Conectează-te la PostgreSQL
psql postgres

# SAU dacă folosești utilizatorul tău macOS:
psql -d postgres
```

Apoi în psql:
```sql
CREATE DATABASE learning_system;
\q
```

### 2. Rulează Scripturile SQL

```bash
# Din directorul java-version
psql -d learning_system -f database/schema.sql
psql -d learning_system -f database/initial-data.sql
```

**Sau dacă ai nevoie de utilizator specific:**

```bash
psql -U postgres -d learning_system -f database/schema.sql
```

## Verificare

```bash
# Conectează-te la baza de date
psql -d learning_system

# Verifică tabelele
\dt

# Verifică cursurile
SELECT COUNT(*) FROM courses;

# Ieși
\q
```

## Probleme Comune

### Eroare: "psql: error: connection to server failed"

**Soluție:** Pornește serviciul PostgreSQL:
```bash
brew services start postgresql@16
```

### Eroare: "role 'postgres' does not exist"

**Soluție:** Pe macOS, utilizatorul implicit este numele tău de utilizator, nu "postgres":
```bash
# Folosește utilizatorul tău
psql -d learning_system

# SAU creează utilizatorul postgres
createuser -s postgres
```

### Eroare: "database 'learning_system' does not exist"

**Soluție:** Creează baza de date:
```bash
createdb learning_system
```

## Configurare pentru Aplicația Java

După ce ai instalat PostgreSQL, actualizează `application.properties`:

```properties
# Dacă folosești utilizatorul tău macOS (nu postgres)
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_system
spring.datasource.username=your_macos_username
spring.datasource.password=

# SAU dacă ai creat utilizatorul postgres
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_system
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Comenzi Utile

```bash
# Pornește PostgreSQL
brew services start postgresql@16

# Oprește PostgreSQL
brew services stop postgresql@16

# Restart PostgreSQL
brew services restart postgresql@16

# Verifică status
brew services list

# Conectează-te la baza de date
psql -d learning_system

# Listă toate bazele de date
psql -l
```
