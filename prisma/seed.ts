import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

const courses = [
  {
    title: 'Advanced Machine Learning with Python',
    description: 'Deepen your ML knowledge with advanced techniques and practical projects.',
    provider: 'DataCamp',
    level: 'Intermediate to Advanced',
    duration: '8 weeks',
    url: 'https://www.datacamp.com/courses/machine-learning-for-developers',
    marketRelevance: 0.90,
    skills: ['Python', 'Machine Learning', 'Data Science'],
    prerequisites: ['Python', 'Machine Learning'],
  },
  {
    title: 'Data Engineering with Apache Spark',
    description: 'Learn to build scalable data pipelines with Apache Spark.',
    provider: 'Coursera',
    level: 'Intermediate',
    duration: '6 weeks',
    url: 'https://www.coursera.org/learn/data-engineering-with-apache-spark',
    marketRelevance: 0.85,
    skills: ['Data Engineering', 'Python', 'Big Data'],
    prerequisites: ['Python', 'SQL'],
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Master AWS services and application deployment in the cloud.',
    provider: 'Udemy',
    level: 'Beginner to Intermediate',
    duration: '10 weeks',
    url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/',
    marketRelevance: 0.95,
    skills: ['Cloud Computing', 'DevOps'],
    prerequisites: ['Linux'],
  },
  {
    title: 'DevOps and CI/CD',
    description: 'Learn modern DevOps practices and deployment automation.',
    provider: 'Pluralsight',
    level: 'Intermediate',
    duration: '6 weeks',
    url: 'https://www.pluralsight.com/courses/docker-devops',
    marketRelevance: 0.88,
    skills: ['DevOps', 'Docker'],
    prerequisites: ['Linux'],
  },
  {
    title: 'PowerBI for Data Analysis and Visualization',
    description: 'Master PowerBI for business intelligence, dashboard creation, and data-driven decision making.',
    provider: 'LinkedIn Learning',
    level: 'Beginner to Advanced',
    duration: '6 weeks',
    url: 'https://www.linkedin.com/learning/topics/power-bi',
    marketRelevance: 0.92,
    skills: ['PowerBI', 'Excel'],
    prerequisites: ['Excel'],
  },
  {
    title: 'Excel Professional: From Basics to Advanced',
    description: 'Comprehensive Excel course covering formulas, pivot tables, and advanced data analysis techniques.',
    provider: 'Coursera',
    level: 'Beginner to Advanced',
    duration: '5 weeks',
    url: 'https://www.coursera.org/courses?query=excel',
    marketRelevance: 0.85,
    skills: ['Excel'],
    prerequisites: [],
  },
  {
    title: 'Azure Cloud Fundamentals',
    description: 'Learn the basics of Microsoft Azure and cloud infrastructure.',
    provider: 'Microsoft Learn',
    level: 'Beginner',
    duration: '4 weeks',
    url: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/',
    marketRelevance: 0.80,
    skills: ['Azure', 'Cloud Computing'],
    prerequisites: [],
  },
  {
    title: 'Introduction to Project Management',
    description: 'Get started with project management methodologies including Agile and Scrum.',
    provider: 'edX',
    level: 'Beginner',
    duration: '3 weeks',
    url: 'https://www.edx.org/learn/project-management',
    marketRelevance: 0.75,
    skills: ['Project Management', 'Agile'],
    prerequisites: [],
  },
  {
    title: 'Full Stack Web Development Bootcamp',
    description: 'Become a full stack web developer with hands-on projects and real-world applications.',
    provider: 'Udemy',
    level: 'Beginner to Advanced',
    duration: '12 weeks',
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    marketRelevance: 0.90,
    skills: ['Full Stack Development', 'JavaScript', 'React'],
    prerequisites: ['HTML', 'CSS'],
  },
  {
    title: 'Docker and DevOps Essentials',
    description: 'Learn containerization and DevOps practices using Docker and CI/CD pipelines.',
    provider: 'Pluralsight',
    level: 'Intermediate',
    duration: '4 weeks',
    url: 'https://www.pluralsight.com/courses/docker-devops',
    marketRelevance: 0.87,
    skills: ['Docker', 'DevOps'],
    prerequisites: ['Linux'],
  },
  {
    title: 'Building Web Applications with Flask',
    description: 'Develop and deploy web applications using Flask and Python.',
    provider: 'Codecademy',
    level: 'Intermediate',
    duration: '5 weeks',
    url: 'https://www.codecademy.com/learn/paths/build-python-web-apps-with-flask',
    marketRelevance: 0.82,
    skills: ['Python', 'Flask', 'Web Development'],
    prerequisites: [],
  },
  {
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into advanced JavaScript topics and patterns.',
    provider: 'Udemy',
    level: 'Advanced',
    duration: '6 weeks',
    url: 'https://www.udemy.com/course/advanced-javascript-concepts/',
    marketRelevance: 0.85,
    skills: ['JavaScript', 'Web Development'],
    prerequisites: [],
  },
  {
    title: 'C# Backend Development',
    description: 'Build robust backend systems using C# and .NET.',
    provider: 'Pluralsight',
    level: 'Intermediate',
    duration: '8 weeks',
    url: 'https://www.pluralsight.com/courses/csharp-backend-development',
    marketRelevance: 0.80,
    skills: ['C#', '.NET', 'Backend Development'],
    prerequisites: [],
  },
  {
    title: 'React Fundamentals',
    description: 'Learn the basics of React and modern frontend development.',
    provider: 'Codecademy',
    level: 'Beginner to Intermediate',
    duration: '4 weeks',
    url: 'https://www.codecademy.com/learn/react-101',
    marketRelevance: 0.90,
    skills: ['React', 'JavaScript', 'Frontend Development'],
    prerequisites: [],
  },
  {
    title: 'Python for Data Science',
    description: 'Use Python for data analysis and machine learning projects.',
    provider: 'Coursera',
    level: 'Beginner to Intermediate',
    duration: '6 weeks',
    url: 'https://www.coursera.org/learn/python-data-science',
    marketRelevance: 0.92,
    skills: ['Python', 'Data Science', 'Machine Learning'],
    prerequisites: [],
  },
  {
    title: 'SQL Bootcamp',
    description: 'Master SQL for all major databases.',
    provider: 'Udemy',
    level: 'Beginner to Advanced',
    duration: '5 weeks',
    url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/',
    marketRelevance: 0.88,
    skills: ['SQL', 'Database'],
    prerequisites: [],
  },
  {
    title: 'Azure DevOps Engineer Expert',
    description: 'Become an expert in Azure DevOps and CI/CD pipelines.',
    provider: 'Microsoft Learn',
    level: 'Advanced',
    duration: '8 weeks',
    url: 'https://learn.microsoft.com/en-us/certifications/devops-engineer/',
    marketRelevance: 0.87,
    skills: ['Azure', 'DevOps', 'CI/CD'],
    prerequisites: [],
  },
  {
    title: 'Linux Essentials',
    description: 'Get started with Linux for development and operations.',
    provider: 'edX',
    level: 'Beginner',
    duration: '3 weeks',
    url: 'https://www.edx.org/learn/linux',
    marketRelevance: 0.80,
    skills: ['Linux', 'System Administration'],
    prerequisites: [],
  },
  {
    title: 'Agile Project Management',
    description: 'Master Agile and Scrum for modern project management.',
    provider: 'Coursera',
    level: 'Intermediate',
    duration: '4 weeks',
    url: 'https://www.coursera.org/learn/agile-project-management',
    marketRelevance: 0.83,
    skills: ['Agile', 'Scrum', 'Project Management'],
    prerequisites: [],
  },
  {
    title: 'HTML & CSS for Beginners',
    description: 'Start your web development journey with HTML and CSS.',
    provider: 'Codecademy',
    level: 'Beginner',
    duration: '2 weeks',
    url: 'https://www.codecademy.com/learn/learn-html',
    marketRelevance: 0.75,
    skills: ['HTML', 'CSS', 'Web Development'],
    prerequisites: [],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  for (const courseData of courses) {
    // Check if course already exists
    const existing = await prisma.course.findFirst({
      where: { title: courseData.title },
    })

    if (existing) {
      console.log(`⏭️  Course "${courseData.title}" already exists, skipping...`)
      continue
    }

    // Create course with skills and prerequisites
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        provider: courseData.provider,
        level: courseData.level,
        duration: courseData.duration,
        url: courseData.url,
        marketRelevance: courseData.marketRelevance,
        skills: {
          create: courseData.skills.map(skillName => ({
            skillName,
          })),
        },
        prerequisites: {
          create: courseData.prerequisites.map(prereq => ({
            prerequisiteSkill: prereq,
          })),
        },
      },
    })

    console.log(`✅ Created course: ${course.title}`)
  }

  console.log('✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
