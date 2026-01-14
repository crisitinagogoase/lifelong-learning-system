# Exemple Practice SQL - Cum să Folosești Baza de Date

Acest document conține exemple practice de cum să folosești SQL-ul direct în aplicația ta.

## Conținut

1. [Operații de Bază](#operații-de-bază)
2. [Interogări Complexe](#interogări-complexe)
3. [Cum să Integrezi în Java](#cum-să-integrezi-în-java)

---

## Operații de Bază

### 1. Adaugă Utilizator Nou

```sql
-- Hash-uiește parola înainte (folosește BCrypt în Java)
INSERT INTO users (name, email, password) 
VALUES ('Maria Ionescu', 'maria@example.com', '$2a$10$hashedpassword')
RETURNING id, name, email;
```

### 2. Adaugă Competențe Utilizator

```sql
-- Adaugă mai multe competențe deodată
INSERT INTO user_skills (user_id, skill_name, skill_level, category) VALUES
(1, 'Python', 75, 'programming'),
(1, 'JavaScript', 65, 'programming'),
(1, 'React', 60, 'frontend'),
(1, 'SQL', 80, 'database');
```

### 3. Înscrie Utilizator la Curs

```sql
INSERT INTO course_enrollments (user_id, course_id, progress) 
VALUES (1, 5, 0);
```

### 4. Actualizează Progres Curs

```sql
UPDATE course_enrollments 
SET progress = 50 
WHERE user_id = 1 AND course_id = 5;
```

### 5. Marchează Curs ca Completat

```sql
UPDATE course_enrollments 
SET progress = 100, completed_at = CURRENT_TIMESTAMP 
WHERE user_id = 1 AND course_id = 5;
```

---

## Interogări Complexe

### 1. Dashboard Utilizator (Toate Informațiile)

```sql
SELECT 
    u.id,
    u.name,
    u.email,
    up.bio,
    up.career_goal,
    COUNT(DISTINCT us.id) as total_skills,
    COUNT(DISTINCT ce.id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN ce.progress = 100 THEN ce.id END) as completed_courses,
    AVG(ce.progress) as avg_progress
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN course_enrollments ce ON u.id = ce.user_id
WHERE u.id = 1
GROUP BY u.id, u.name, u.email, up.bio, up.career_goal;
```

### 2. Competențe Utilizator cu Niveluri

```sql
SELECT 
    skill_name,
    skill_level,
    category,
    CASE 
        WHEN skill_level >= 75 THEN 'Avansat'
        WHEN skill_level >= 50 THEN 'Intermediar'
        ELSE 'Începător'
    END as level_description
FROM user_skills
WHERE user_id = 1
ORDER BY skill_level DESC;
```

### 3. Cursuri Recomandate (Bazate pe Competențe)

```sql
-- Găsește cursuri care se potrivesc cu competențele utilizatorului
SELECT DISTINCT 
    c.id,
    c.title,
    c.description,
    c.provider,
    c.level,
    c.market_relevance,
    COUNT(DISTINCT cs.skill_name) as matching_skills
FROM courses c
JOIN course_skills cs ON c.id = cs.course_id
JOIN user_skills us ON cs.skill_name = us.skill_name
WHERE us.user_id = 1
  AND c.id NOT IN (
      SELECT course_id FROM course_enrollments WHERE user_id = 1
  )
GROUP BY c.id, c.title, c.description, c.provider, c.level, c.market_relevance
ORDER BY c.market_relevance DESC, matching_skills DESC
LIMIT 10;
```

### 4. Cursuri Recomandate (Bazate pe Competențe Lipsă)

```sql
-- Găsește cursuri care acoperă competențe cu cerere mare pe piață
SELECT DISTINCT
    c.id,
    c.title,
    mt.skill_name,
    mt.demand,
    mt.growth_percentage,
    mt.avg_salary,
    c.market_relevance
FROM courses c
JOIN course_skills cs ON c.id = cs.course_id
JOIN market_trends mt ON cs.skill_name = mt.skill_name
WHERE mt.demand = 'high'
  AND cs.skill_name NOT IN (
      SELECT skill_name FROM user_skills WHERE user_id = 1
  )
ORDER BY mt.growth_percentage DESC, c.market_relevance DESC
LIMIT 10;
```

### 5. Progres Cursuri Utilizator

```sql
SELECT 
    c.title,
    c.provider,
    ce.progress,
    ce.enrolled_at,
    ce.completed_at,
    CASE 
        WHEN ce.progress = 100 THEN 'Completat'
        WHEN ce.progress >= 50 THEN 'În progres'
        ELSE 'Început'
    END as status
FROM course_enrollments ce
JOIN courses c ON ce.course_id = c.id
WHERE ce.user_id = 1
ORDER BY ce.enrolled_at DESC;
```

### 6. Statistici Competențe

```sql
-- Competențe utilizator vs cerere piață
SELECT 
    us.skill_name,
    us.skill_level as user_level,
    mt.demand,
    mt.growth_percentage,
    mt.avg_salary,
    CASE 
        WHEN us.skill_level >= 75 AND mt.demand = 'high' THEN 'Excelent'
        WHEN us.skill_level >= 50 AND mt.demand = 'high' THEN 'Bun'
        WHEN mt.demand = 'high' THEN 'De îmbunătățit'
        ELSE 'OK'
    END as assessment
FROM user_skills us
LEFT JOIN market_trends mt ON us.skill_name = mt.skill_name
WHERE us.user_id = 1
ORDER BY mt.growth_percentage DESC NULLS LAST;
```

### 7. Top Competențe Cerute pe Piață

```sql
SELECT 
    skill_name,
    demand,
    growth_percentage,
    avg_salary,
    COUNT(DISTINCT cs.course_id) as available_courses
FROM market_trends mt
LEFT JOIN course_skills cs ON mt.skill_name = cs.skill_name
WHERE demand = 'high'
GROUP BY skill_name, demand, growth_percentage, avg_salary
ORDER BY growth_percentage DESC;
```

---

## Cum să Integrezi în Java

### Exemplu 1: Query Simplu în Repository

```java
@Repository
public class UserRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // Query simplu
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }
    
    // Query cu parametri
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, new UserRowMapper(), email);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
```

### Exemplu 2: Query Complex cu JOIN

```java
@Repository
public class DashboardRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Map<String, Object> getUserDashboard(Integer userId) {
        String sql = """
            SELECT 
                u.id,
                u.name,
                u.email,
                up.bio,
                up.career_goal,
                COUNT(DISTINCT us.id) as total_skills,
                COUNT(DISTINCT ce.id) as enrolled_courses,
                COUNT(DISTINCT CASE WHEN ce.progress = 100 THEN ce.id END) as completed_courses,
                AVG(ce.progress) as avg_progress
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN user_skills us ON u.id = us.user_id
            LEFT JOIN course_enrollments ce ON u.id = ce.user_id
            WHERE u.id = ?
            GROUP BY u.id, u.name, u.email, up.bio, up.career_goal
            """;
        
        return jdbcTemplate.queryForMap(sql, userId);
    }
}
```

### Exemplu 3: Insert cu RETURNING

```java
@Repository
public class CourseRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Course save(Course course) {
        String sql = """
            INSERT INTO courses (title, description, provider, level, duration, market_relevance)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING id, created_at
            """;
        
        return jdbcTemplate.queryForObject(sql, new CourseRowMapper(),
            course.getTitle(),
            course.getDescription(),
            course.getProvider(),
            course.getLevel(),
            course.getDuration(),
            course.getMarketRelevance()
        );
    }
}
```

### Exemplu 4: Update cu Condiții

```java
@Repository
public class EnrollmentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public void updateProgress(Integer userId, Integer courseId, Integer progress) {
        String sql = """
            UPDATE course_enrollments 
            SET progress = ?, 
                completed_at = CASE WHEN ? = 100 THEN CURRENT_TIMESTAMP ELSE NULL END
            WHERE user_id = ? AND course_id = ?
            """;
        
        jdbcTemplate.update(sql, progress, progress, userId, courseId);
    }
}
```

### Exemplu 5: Query cu Multiple Results

```java
@Repository
public class RecommendationRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public List<Course> getRecommendedCourses(Integer userId) {
        String sql = """
            SELECT DISTINCT 
                c.id,
                c.title,
                c.description,
                c.provider,
                c.level,
                c.market_relevance
            FROM courses c
            JOIN course_skills cs ON c.id = cs.course_id
            JOIN user_skills us ON cs.skill_name = us.skill_name
            WHERE us.user_id = ?
              AND c.id NOT IN (
                  SELECT course_id FROM course_enrollments WHERE user_id = ?
              )
            ORDER BY c.market_relevance DESC
            LIMIT 10
            """;
        
        return jdbcTemplate.query(sql, new CourseRowMapper(), userId, userId);
    }
}
```

---

## Sfaturi pentru Integrare

### 1. Folosește Prepared Statements (Parametri)

**BINE:**
```java
String sql = "SELECT * FROM users WHERE email = ?";
jdbcTemplate.query(sql, mapper, email);
```

**RĂU (SQL Injection):**
```java
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
```

### 2. Folosește RowMapper pentru Rezultate

```java
private static class UserRowMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        // ...
        return user;
    }
}
```

### 3. Gestionează Excepțiile

```java
public Optional<User> findById(Integer id) {
    try {
        User user = jdbcTemplate.queryForObject(sql, mapper, id);
        return Optional.of(user);
    } catch (EmptyResultDataAccessException e) {
        return Optional.empty();
    }
}
```

### 4. Folosește Transactions pentru Operații Multiple

```java
@Transactional
public void createUserWithProfile(User user, UserProfile profile) {
    User savedUser = userRepository.save(user);
    profile.setUserId(savedUser.getId());
    profileRepository.save(profile);
}
```

---

## Testare SQL Direct

Poți testa toate aceste query-uri direct în psql:

```bash
psql -U postgres -d learning_system

# Apoi copiază și lipește query-ul
SELECT * FROM users;
```

---

**Notă:** Toate exemplele presupun că ai rulat deja `schema.sql` și `initial-data.sql`.
