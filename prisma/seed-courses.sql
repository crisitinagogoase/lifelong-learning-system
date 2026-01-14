-- Seed courses data
-- This script adds initial course data to the database

-- Insert courses
INSERT INTO "Course" (title, description, provider, level, duration, url, "marketRelevance") VALUES
('Advanced Machine Learning with Python', 'Deepen your ML knowledge with advanced techniques and practical projects.', 'DataCamp', 'Intermediate to Advanced', '8 weeks', 'https://www.datacamp.com/courses/machine-learning-for-developers', 0.90),
('Data Engineering with Apache Spark', 'Learn to build scalable data pipelines with Apache Spark.', 'Coursera', 'Intermediate', '6 weeks', 'https://www.coursera.org/learn/data-engineering-with-apache-spark', 0.85),
('Cloud Computing with AWS', 'Master AWS services and application deployment in the cloud.', 'Udemy', 'Beginner to Intermediate', '10 weeks', 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/', 0.95),
('DevOps and CI/CD', 'Learn modern DevOps practices and deployment automation.', 'Pluralsight', 'Intermediate', '6 weeks', 'https://www.pluralsight.com/courses/docker-devops', 0.88),
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

-- Insert course skills
INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Python' FROM "Course" c WHERE c.title = 'Advanced Machine Learning with Python'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Machine Learning' FROM "Course" c WHERE c.title = 'Advanced Machine Learning with Python'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Data Science' FROM "Course" c WHERE c.title = 'Advanced Machine Learning with Python'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Data Engineering' FROM "Course" c WHERE c.title = 'Data Engineering with Apache Spark'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Python' FROM "Course" c WHERE c.title = 'Data Engineering with Apache Spark'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Big Data' FROM "Course" c WHERE c.title = 'Data Engineering with Apache Spark'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Cloud Computing' FROM "Course" c WHERE c.title = 'Cloud Computing with AWS'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'DevOps' FROM "Course" c WHERE c.title = 'Cloud Computing with AWS'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'DevOps' FROM "Course" c WHERE c.title = 'DevOps and CI/CD'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Docker' FROM "Course" c WHERE c.title = 'DevOps and CI/CD'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'PowerBI' FROM "Course" c WHERE c.title = 'PowerBI for Data Analysis and Visualization'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Excel' FROM "Course" c WHERE c.title = 'PowerBI for Data Analysis and Visualization'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Excel' FROM "Course" c WHERE c.title = 'Excel Professional: From Basics to Advanced'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Azure' FROM "Course" c WHERE c.title = 'Azure Cloud Fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Cloud Computing' FROM "Course" c WHERE c.title = 'Azure Cloud Fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Project Management' FROM "Course" c WHERE c.title = 'Introduction to Project Management'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Agile' FROM "Course" c WHERE c.title = 'Introduction to Project Management'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Full Stack Development' FROM "Course" c WHERE c.title = 'Full Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'JavaScript' FROM "Course" c WHERE c.title = 'Full Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'React' FROM "Course" c WHERE c.title = 'Full Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'Docker' FROM "Course" c WHERE c.title = 'Docker and DevOps Essentials'
ON CONFLICT DO NOTHING;

INSERT INTO "CourseSkill" ("courseId", "skillName")
SELECT c.id, 'DevOps' FROM "Course" c WHERE c.title = 'Docker and DevOps Essentials'
ON CONFLICT DO NOTHING;

-- Insert prerequisites
INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Python' FROM "Course" c WHERE c.title = 'Advanced Machine Learning with Python'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Machine Learning' FROM "Course" c WHERE c.title = 'Advanced Machine Learning with Python'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Python' FROM "Course" c WHERE c.title = 'Data Engineering with Apache Spark'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'SQL' FROM "Course" c WHERE c.title = 'Data Engineering with Apache Spark'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Linux' FROM "Course" c WHERE c.title = 'Cloud Computing with AWS'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Linux' FROM "Course" c WHERE c.title = 'DevOps and CI/CD'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Excel' FROM "Course" c WHERE c.title = 'PowerBI for Data Analysis and Visualization'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'HTML' FROM "Course" c WHERE c.title = 'Full Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'CSS' FROM "Course" c WHERE c.title = 'Full Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;

INSERT INTO "CoursePrerequisite" ("courseId", "prerequisiteSkill")
SELECT c.id, 'Linux' FROM "Course" c WHERE c.title = 'Docker and DevOps Essentials'
ON CONFLICT DO NOTHING;
