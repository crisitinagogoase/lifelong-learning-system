-- ============================================
-- DATE INIȚIALE - LEARNING SYSTEM
-- ============================================
-- Acest script adaugă date de test și cursuri
-- Rulează-l cu: psql -U postgres -d learning_system -f initial-data.sql

-- 1. Adaugă Trend-uri Piață
INSERT INTO market_trends (skill_name, demand, growth_percentage, avg_salary) VALUES
('Machine Learning', 'high', 35, 85000),
('Data Science', 'high', 30, 80000),
('Cloud Computing', 'high', 42, 90000),
('DevOps', 'high', 28, 95000),
('Full Stack Development', 'medium', 25, 75000),
('Cybersecurity', 'high', 38, 88000),
('Blockchain', 'medium', 22, 92000),
('AI/ML', 'high', 40, 95000),
('Data Engineering', 'high', 32, 85000),
('Mobile Development', 'medium', 20, 70000),
('PowerBI', 'medium', 25, 72000),
('Excel', 'medium', 15, 65000),
('Python', 'high', 30, 80000),
('JavaScript', 'high', 28, 78000),
('React', 'high', 32, 82000),
('SQL', 'high', 22, 75000),
('Docker', 'high', 35, 90000),
('Azure', 'high', 38, 88000),
('Project Management', 'medium', 18, 70000),
('Agile', 'medium', 20, 72000)
ON CONFLICT (skill_name) DO NOTHING;

-- 2. Adaugă Cursuri
INSERT INTO courses (title, description, provider, level, duration, url, market_relevance) VALUES
('Advanced Machine Learning with Python', 'Deepen your ML knowledge with advanced techniques and practical projects.', 'DataCamp', 'Intermediate to Advanced', '8 weeks', 'https://www.datacamp.com/courses/machine-learning-for-developers', 0.90),
('Data Engineering avec Apache Spark', 'Apprenez à construire des pipelines de données évolutifs avec Apache Spark.', 'Coursera', 'Intermediate', '6 semaines', 'https://www.coursera.org/learn/data-engineering-with-apache-spark', 0.85),
('Cloud Computing avec AWS', 'Maîtrisez les services AWS et le déploiement d''applications dans le cloud.', 'Udemy', 'Débutant à Intermédiaire', '10 semaines', 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/', 0.95),
('DevOps et CI/CD', 'Apprenez les pratiques DevOps modernes et l''automatisation du déploiement.', 'Pluralsight', 'Intermediate', '6 semaines', 'https://www.pluralsight.com/courses/docker-devops', 0.88),
('PowerBI for Data Analysis and Visualization', 'Master PowerBI for business intelligence, dashboard creation, and data-driven decision making.', 'LinkedIn Learning', 'Beginner to Advanced', '6 weeks', 'https://www.linkedin.com/learning/topics/power-bi', 0.92),
('Excel Professional: From Basics to Advanced', 'Comprehensive Excel course covering formulas, pivot tables, and advanced data analysis techniques.', 'Coursera', 'Beginner to Advanced', '5 weeks', 'https://www.coursera.org/courses?query=excel', 0.85),
('Azure Cloud Fundamentals', 'Learn the basics of Microsoft Azure and cloud infrastructure.', 'Microsoft Learn', 'Beginner', '4 weeks', 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/', 0.80),
('Introduction to Project Management', 'Get started with project management methodologies including Agile and Scrum.', 'edX', 'Beginner', '3 weeks', 'https://www.edx.org/learn/project-management', 0.75),
('Full Stack Web Development Bootcamp', 'Become a full stack web developer with hands-on projects and real-world applications.', 'Udemy', 'Beginner to Advanced', '12 weeks', 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', 0.90),
('Docker and DevOps Essentials', 'Learn containerization and DevOps practices using Docker and CI/CD pipelines.', 'Pluralsight', 'Intermediate', '4 weeks', 'https://www.pluralsight.com/courses/docker-devops', 0.87),
('Building Web Applications with Flask', 'Develop and deploy web applications using Flask and Python.', 'Codecademy', 'Intermediate', '5 weeks', 'https://www.codecademy.com/learn/paths/build-python-web-apps-with-flask', 0.82),
('Advanced JavaScript Concepts', 'Deep dive into advanced JavaScript topics and patterns.', 'Udemy', 'Advanced', '6 weeks', 'https://www.udemy.com/course/advanced-javascript-concepts/', 0.85),
('C# Backend Development', 'Build robust backend systems using C# and .NET.', 'Pluralsight', 'Intermediate', '8 weeks', 'https://www.pluralsight.com/courses/csharp-backend-development', 0.80),
('React Fundamentals', 'Learn the basics of React and modern frontend development.', 'Codecademy', 'Beginner to Intermediate', '4 weeks', 'https://www.codecademy.com/learn/react-101', 0.90),
('Python for Data Science', 'Use Python for data analysis and machine learning projects.', 'Coursera', 'Beginner to Intermediate', '6 weeks', 'https://www.coursera.org/learn/python-data-science', 0.92),
('SQL Bootcamp', 'Master SQL for all major databases.', 'Udemy', 'Beginner to Advanced', '5 weeks', 'https://www.udemy.com/course/the-complete-sql-bootcamp/', 0.88),
('Azure DevOps Engineer Expert', 'Become an expert in Azure DevOps and CI/CD pipelines.', 'Microsoft Learn', 'Advanced', '8 weeks', 'https://learn.microsoft.com/en-us/certifications/devops-engineer/', 0.87),
('Linux Essentials', 'Get started with Linux for development and operations.', 'edX', 'Beginner', '3 weeks', 'https://www.edx.org/learn/linux', 0.80),
('Agile Project Management', 'Master Agile and Scrum for modern project management.', 'Coursera', 'Intermediate', '4 weeks', 'https://www.coursera.org/learn/agile-project-management', 0.83),
('HTML & CSS for Beginners', 'Start your web development journey with HTML and CSS.', 'Codecademy', 'Beginner', '2 weeks', 'https://www.codecademy.com/learn/learn-html', 0.75)
ON CONFLICT DO NOTHING;

-- 3. Adaugă Competențe pentru Cursuri
-- Curs 1: Advanced Machine Learning
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Python' FROM courses WHERE title = 'Advanced Machine Learning with Python';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Machine Learning' FROM courses WHERE title = 'Advanced Machine Learning with Python';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Data Science' FROM courses WHERE title = 'Advanced Machine Learning with Python';

-- Curs 2: Data Engineering
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Data Engineering' FROM courses WHERE title = 'Data Engineering avec Apache Spark';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Python' FROM courses WHERE title = 'Data Engineering avec Apache Spark';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Big Data' FROM courses WHERE title = 'Data Engineering avec Apache Spark';

-- Curs 3: AWS Cloud
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Cloud Computing' FROM courses WHERE title = 'Cloud Computing avec AWS';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'DevOps' FROM courses WHERE title = 'Cloud Computing avec AWS';

-- Curs 4: DevOps
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'DevOps' FROM courses WHERE title = 'DevOps et CI/CD';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Docker' FROM courses WHERE title = 'DevOps et CI/CD';

-- Curs 5: PowerBI
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'PowerBI' FROM courses WHERE title = 'PowerBI for Data Analysis and Visualization';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Excel' FROM courses WHERE title = 'PowerBI for Data Analysis and Visualization';

-- Curs 6: Excel
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Excel' FROM courses WHERE title = 'Excel Professional: From Basics to Advanced';

-- Curs 7: Azure
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Azure' FROM courses WHERE title = 'Azure Cloud Fundamentals';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Cloud Computing' FROM courses WHERE title = 'Azure Cloud Fundamentals';

-- Curs 8: Project Management
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Project Management' FROM courses WHERE title = 'Introduction to Project Management';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Agile' FROM courses WHERE title = 'Introduction to Project Management';

-- Curs 9: Full Stack
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Full Stack Development' FROM courses WHERE title = 'Full Stack Web Development Bootcamp';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'JavaScript' FROM courses WHERE title = 'Full Stack Web Development Bootcamp';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'React' FROM courses WHERE title = 'Full Stack Web Development Bootcamp';

-- Curs 10: Docker
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'Docker' FROM courses WHERE title = 'Docker and DevOps Essentials';
INSERT INTO course_skills (course_id, skill_name) 
SELECT id, 'DevOps' FROM courses WHERE title = 'Docker and DevOps Essentials';

-- 4. Adaugă Prerequisite-uri pentru Cursuri
-- Curs 1: Advanced ML (necesită Python și ML de bază)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Python' FROM courses WHERE title = 'Advanced Machine Learning with Python';
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Machine Learning' FROM courses WHERE title = 'Advanced Machine Learning with Python';

-- Curs 2: Data Engineering (necesită Python și SQL)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Python' FROM courses WHERE title = 'Data Engineering avec Apache Spark';
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'SQL' FROM courses WHERE title = 'Data Engineering avec Apache Spark';

-- Curs 3: AWS (necesită Linux și Networking)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Linux' FROM courses WHERE title = 'Cloud Computing avec AWS';

-- Curs 4: DevOps (necesită Linux și Git)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Linux' FROM courses WHERE title = 'DevOps et CI/CD';

-- Curs 5: PowerBI (necesită Excel)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Excel' FROM courses WHERE title = 'PowerBI for Data Analysis and Visualization';

-- Curs 9: Full Stack (necesită HTML și CSS)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'HTML' FROM courses WHERE title = 'Full Stack Web Development Bootcamp';
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'CSS' FROM courses WHERE title = 'Full Stack Web Development Bootcamp';

-- Curs 10: Docker (necesită Linux)
INSERT INTO course_prerequisites (course_id, prerequisite_skill) 
SELECT id, 'Linux' FROM courses WHERE title = 'Docker and DevOps Essentials';

-- ============================================
-- MESAJ FINAL
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Date inițiale au fost adăugate cu succes!';
    RAISE NOTICE 'Verifică datele cu: SELECT * FROM courses;';
END $$;
