# Ghid de Setup - Versiune Java

Acest ghid te ajută pas cu pas să configurezi și să rulezi aplicația Java simplificată.

## Pași de Instalare

### 1. Instalează Java 17

**Windows:**
- Descarcă de la: https://adoptium.net/
- Instalează și adaugă la PATH

**macOS:**
```bash
brew install openjdk@17
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

Verifică instalarea:
```bash
java -version
```

### 2. Instalează Maven

**Windows:**
- Descarcă de la: https://maven.apache.org/download.cgi
- Extrage și adaugă la PATH

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

Verifică instalarea:
```bash
mvn -version
```

### 3. Configurează PostgreSQL

**Creează baza de date:**
```bash
psql -U postgres
CREATE DATABASE learning_system;
\q
```

**Rulează scripturile SQL:**
```bash
# Din directorul java-version
psql -U postgres -d learning_system -f database/schema.sql
psql -U postgres -d learning_system -f database/initial-data.sql
```

### 4. Configurează Aplicația

Editează `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_system
spring.datasource.username=postgres
spring.datasource.password=PAROLA_TA_AICI
```

### 5. Rulează Aplicația

**Opțiunea 1: Cu Maven**
```bash
mvn spring-boot:run
```

**Opțiunea 2: Build și Run**
```bash
mvn clean package
java -jar target/learning-system-1.0.0.jar
```

Aplicația va rula pe: `http://localhost:8080`

## Testare API

### 1. Înregistrare Utilizator

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ion Popescu",
    "email": "ion@example.com",
    "password": "parola123"
  }'
```

### 2. Autentificare

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ion@example.com",
    "password": "parola123"
  }'
```

### 3. Listă Cursuri

```bash
curl http://localhost:8080/api/courses
```

### 4. Recomandări Cursuri

```bash
curl "http://localhost:8080/api/courses/recommendations?userId=1"
```

## Structura Proiectului

```
java-version/
├── database/              # Scripturi SQL
│   ├── schema.sql
│   ├── initial-data.sql
│   └── README-SQL.md
├── src/
│   └── main/
│       ├── java/
│       │   └── com/learning/
│       │       ├── LearningApplication.java
│       │       ├── controller/    # REST Controllers
│       │       ├── service/       # Business Logic
│       │       ├── repository/    # SQL Queries
│       │       └── model/         # Clase de date
│       └── resources/
│           └── application.properties
└── pom.xml                # Dependencies Maven
```

## Probleme Comune

### Port 8080 deja folosit

Modifică în `application.properties`:
```properties
server.port=8081
```

### Eroare conexiune baza de date

Verifică:
1. PostgreSQL rulează: `pg_isready`
2. Credențialele din `application.properties`
3. Baza de date există: `psql -U postgres -l`

### Eroare "Class not found"

Rulează:
```bash
mvn clean install
```

## Next Steps

1. Adaugă autentificare JWT pentru securitate
2. Implementează endpoint-uri pentru profil utilizator
3. Adaugă validare mai complexă
4. Implementează logging mai detaliat
