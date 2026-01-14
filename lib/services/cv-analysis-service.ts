import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

type Skill = {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  category: string
}

type Experience = {
  title: string
  company: string
  duration: number 
  skills: string[]
  description: string
}

export type CVAnalysisResult = {
  skills: Skill[]
  experiences: Experience[]
  education: string[]
  languages: { name: string; level: string }[]
  summary: string
}

// Market data for skill trends
const MARKET_TRENDS = {
  "Machine Learning": { demand: "high", growth: 35, avgSalary: 85000 },
  "Data Science": { demand: "high", growth: 30, avgSalary: 80000 },
  "Cloud Computing": { demand: "high", growth: 42, avgSalary: 90000 },
  "DevOps": { demand: "high", growth: 28, avgSalary: 95000 },
  "Full Stack Development": { demand: "medium", growth: 25, avgSalary: 75000 },
  "Cybersecurity": { demand: "high", growth: 38, avgSalary: 88000 },
  "Blockchain": { demand: "medium", growth: 22, avgSalary: 92000 },
  "AI/ML": { demand: "high", growth: 40, avgSalary: 95000 },
  "Data Engineering": { demand: "high", growth: 32, avgSalary: 85000 },
  "Mobile Development": { demand: "medium", growth: 20, avgSalary: 70000 },
}

// Course database
const COURSES = [
  {
    id: "ml-advanced",
    title: "Advanced Machine Learning with Python",
    provider: "DataCamp",
    level: "Intermediate to Advanced",
    duration: "8 weeks",
    skills: ["Python", "Machine Learning", "Deep Learning", "Data Science"],
    description: "Deepen your ML knowledge with advanced techniques and practical projects.",
    prerequisites: ["Python", "Machine Learning"],
    marketRelevance: 0.9,
    url: "https://www.datacamp.com/courses/machine-learning-for-developers"
  },
  {
    id: "data-engineering",
    title: "Data Engineering avec Apache Spark",
    provider: "Coursera",
    level: "Intermediate",
    duration: "6 semaines",
    skills: ["Big Data", "Apache Spark", "Data Engineering", "Python"],
    description: "Apprenez à construire des pipelines de données évolutifs avec Apache Spark.",
    prerequisites: ["Python", "SQL"],
    marketRelevance: 0.85,
    url: "https://www.coursera.org/learn/data-engineering-with-apache-spark"
  },
  {
    id: "cloud-aws",
    title: "Cloud Computing avec AWS",
    provider: "Udemy",
    level: "Débutant à Intermédiaire",
    duration: "10 semaines",
    skills: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
    description: "Maîtrisez les services AWS et le déploiement d'applications dans le cloud.",
    prerequisites: ["Linux", "Networking"],
    marketRelevance: 0.95,
    url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/"
  },
  {
    id: "devops",
    title: "DevOps et CI/CD",
    provider: "Pluralsight",
    level: "Intermediate",
    duration: "6 semaines",
    skills: ["Docker", "Kubernetes", "CI/CD", "DevOps"],
    description: "Apprenez les pratiques DevOps modernes et l'automatisation du déploiement.",
    prerequisites: ["Linux", "Git"],
    marketRelevance: 0.88,
    url: "https://www.pluralsight.com/courses/docker-devops"
  },
  {
    id: "powerbi-advanced",
    title: "PowerBI for Data Analysis and Visualization",
    provider: "LinkedIn Learning",
    level: "Beginner to Advanced",
    duration: "6 weeks",
    skills: ["PowerBI", "Data Visualization", "Excel", "Reporting"],
    description: "Master PowerBI for business intelligence, dashboard creation, and data-driven decision making.",
    prerequisites: ["Excel"],
    marketRelevance: 0.92,
    url: "https://www.linkedin.com/learning/topics/power-bi"
  },
  {
    id: "excel-pro",
    title: "Excel Professional: From Basics to Advanced",
    provider: "Coursera",
    level: "Beginner to Advanced",
    duration: "5 weeks",
    skills: ["Excel", "Data Analysis", "Pivot Tables", "Formulas"],
    description: "Comprehensive Excel course covering formulas, pivot tables, and advanced data analysis techniques.",
    prerequisites: [],
    marketRelevance: 0.85,
    url: "https://www.coursera.org/courses?query=excel"
  },
  {
    id: "azure-cloud-fundamentals",
    title: "Azure Cloud Fundamentals",
    provider: "Microsoft Learn",
    level: "Beginner",
    duration: "4 weeks",
    skills: ["Azure", "Cloud Computing", "Infrastructure"],
    description: "Learn the basics of Microsoft Azure and cloud infrastructure.",
    prerequisites: [],
    marketRelevance: 0.8,
    url: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/"
  },
  {
    id: "project-management-intro",
    title: "Introduction to Project Management",
    provider: "edX",
    level: "Beginner",
    duration: "3 weeks",
    skills: ["Project Management", "Agile", "Scrum"],
    description: "Get started with project management methodologies including Agile and Scrum.",
    prerequisites: [],
    marketRelevance: 0.75,
    url: "https://www.edx.org/learn/project-management"
  },
  {
    id: "web-dev-fullstack",
    title: "Full Stack Web Development Bootcamp",
    provider: "Udemy",
    level: "Beginner to Advanced",
    duration: "12 weeks",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Web Development"],
    description: "Become a full stack web developer with hands-on projects and real-world applications.",
    prerequisites: ["HTML", "CSS"],
    marketRelevance: 0.9,
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/"
  },
  {
    id: "docker-devops",
    title: "Docker and DevOps Essentials",
    provider: "Pluralsight",
    level: "Intermediate",
    duration: "4 weeks",
    skills: ["Docker", "DevOps", "CI/CD"],
    description: "Learn containerization and DevOps practices using Docker and CI/CD pipelines.",
    prerequisites: ["Linux"],
    marketRelevance: 0.87,
    url: "https://www.pluralsight.com/courses/docker-devops"
  },
  {
    id: "flask-web-apps",
    title: "Building Web Applications with Flask",
    provider: "Codecademy",
    level: "Intermediate",
    duration: "5 weeks",
    skills: ["Flask", "Python", "Web Development"],
    description: "Develop and deploy web applications using Flask and Python.",
    prerequisites: ["Python"],
    marketRelevance: 0.82,
    url: "https://www.codecademy.com/learn/paths/build-python-web-apps-with-flask"
  },
  {
    id: "js-advanced",
    title: "Advanced JavaScript Concepts",
    provider: "Udemy",
    level: "Advanced",
    duration: "6 weeks",
    skills: ["JavaScript", "Web Development", "Full Stack Development"],
    description: "Deep dive into advanced JavaScript topics and patterns.",
    prerequisites: ["JavaScript"],
    marketRelevance: 0.85,
    url: "https://www.udemy.com/course/advanced-javascript-concepts/"
  },
  {
    id: "csharp-backend",
    title: "C# Backend Development",
    provider: "Pluralsight",
    level: "Intermediate",
    duration: "8 weeks",
    skills: ["C#", "Backend Development", "APIs"],
    description: "Build robust backend systems using C# and .NET.",
    prerequisites: ["C#"],
    marketRelevance: 0.8,
    url: "https://www.pluralsight.com/courses/csharp-backend-development"
  },
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    provider: "Codecademy",
    level: "Beginner to Intermediate",
    duration: "4 weeks",
    skills: ["React", "JavaScript", "Frontend"],
    description: "Learn the basics of React and modern frontend development.",
    prerequisites: ["JavaScript"],
    marketRelevance: 0.9,
    url: "https://www.codecademy.com/learn/react-101"
  },
  {
    id: "python-data-science",
    title: "Python for Data Science",
    provider: "Coursera",
    level: "Beginner to Intermediate",
    duration: "6 weeks",
    skills: ["Python", "Data Science", "Machine Learning"],
    description: "Use Python for data analysis and machine learning projects.",
    prerequisites: ["Python"],
    marketRelevance: 0.92,
    url: "https://www.coursera.org/learn/python-data-science"
  },
  {
    id: "sql-bootcamp",
    title: "SQL Bootcamp",
    provider: "Udemy",
    level: "Beginner to Advanced",
    duration: "5 weeks",
    skills: ["SQL", "Database", "Data Analysis"],
    description: "Master SQL for all major databases.",
    prerequisites: [],
    marketRelevance: 0.88,
    url: "https://www.udemy.com/course/the-complete-sql-bootcamp/"
  },
  {
    id: "azure-devops",
    title: "Azure DevOps Engineer Expert",
    provider: "Microsoft Learn",
    level: "Advanced",
    duration: "8 weeks",
    skills: ["Azure", "DevOps", "CI/CD"],
    description: "Become an expert in Azure DevOps and CI/CD pipelines.",
    prerequisites: ["Azure", "DevOps"],
    marketRelevance: 0.87,
    url: "https://learn.microsoft.com/en-us/certifications/devops-engineer/"
  },
  {
    id: "linux-essentials",
    title: "Linux Essentials",
    provider: "edX",
    level: "Beginner",
    duration: "3 weeks",
    skills: ["Linux", "DevOps", "Security"],
    description: "Get started with Linux for development and operations.",
    prerequisites: [],
    marketRelevance: 0.8,
    url: "https://www.edx.org/learn/linux"
  },
  {
    id: "agile-project-mgmt",
    title: "Agile Project Management",
    provider: "Coursera",
    level: "Intermediate",
    duration: "4 weeks",
    skills: ["Agile", "Project Management", "Scrum"],
    description: "Master Agile and Scrum for modern project management.",
    prerequisites: [],
    marketRelevance: 0.83,
    url: "https://www.coursera.org/learn/agile-project-management"
  },
  {
    id: "frontend-html-css",
    title: "HTML & CSS for Beginners",
    provider: "Codecademy",
    level: "Beginner",
    duration: "2 weeks",
    skills: ["HTML", "CSS", "Frontend"],
    description: "Start your web development journey with HTML and CSS.",
    prerequisites: [],
    marketRelevance: 0.75,
    url: "https://www.codecademy.com/learn/learn-html"
  },
]

const TECHNICAL_SKILLS = new Set([
  "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Cassandra",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
  "Git", "CI/CD", "Jenkins", "GitLab", "GitHub Actions",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
  "Data Science", "Data Analysis", "Big Data", "Hadoop", "Spark",
  "DevOps", "SRE", "Linux", "Networking", "Security",
  "Agile", "Scrum", "Project Management", "JIRA", "Confluence"
]);

const JOB_TITLES = {
  "Software Engineer": ["Programming", "Problem Solving", "System Design"],
  "Data Scientist": ["Python", "Machine Learning", "Statistics", "Data Analysis"],
  "DevOps Engineer": ["CI/CD", "Docker", "Kubernetes", "Cloud"],
  "Full Stack Developer": ["Frontend", "Backend", "Database", "API Design"],
  "Data Engineer": ["ETL", "Data Pipeline", "Big Data", "SQL"],
  "Machine Learning Engineer": ["ML", "Deep Learning", "Python", "Statistics"],
  "Cloud Engineer": ["AWS", "Azure", "GCP", "Infrastructure"],
  "Security Engineer": ["Security", "Networking", "Compliance", "Risk Assessment"],
  "Product Manager": ["Product Strategy", "User Research", "Agile", "Analytics"],
  "UX Designer": ["User Research", "Wireframing", "Prototyping", "Design Systems"]
};

const SKILL_SYNONYMS: Record<string, string[]> = {
  "DevOps": ["CI/CD", "Continuous Integration", "Continuous Deployment", "Jenkins", "GitLab", "GitHub Actions", "Docker", "Kubernetes", "Terraform", "Infrastructure as Code"],
  "Data Engineering": ["ETL", "Data Pipeline", "Big Data", "Spark", "Hadoop", "Airflow", "Data Warehouse", "Data Lake"],
  "Full Stack Development": ["Frontend", "Backend", "API Design", "React", "Angular", "Vue", "Node.js", "Express", "HTML", "CSS", "JavaScript", "SQL", "MongoDB", "PostgreSQL", "MySQL"],
  "AI/ML": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Artificial Intelligence", "Neural Networks"],
  "Cybersecurity": ["Security", "Penetration Testing", "Vulnerability Assessment", "Risk Assessment", "Compliance", "Network Security", "Encryption"],
  "Cloud Computing": ["AWS", "Azure", "GCP", "Cloud", "Cloud Infrastructure", "Serverless", "Cloud Services"],
  "Blockchain": ["Smart Contracts", "Ethereum", "Solidity", "Distributed Ledger", "Cryptocurrency"],
  "Mobile Development": ["Android", "iOS", "Swift", "Kotlin", "React Native", "Flutter", "Mobile Apps"],
  "PowerBI": ["Power BI", "Power-BI"],
  "Excel": ["Microsoft Excel"],
  "JavaScript": ["JS"],
  "HTML": ["HTML5"],
  "CSS": ["CSS3"],
  "SQL": ["MySQL", "PostgreSQL", "SQL Server"],
  "Docker": ["Containerization"],
  "Linux": ["Ubuntu", "Debian", "Red Hat"],
};

export class CVAnalysisService {
  private static async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      // validate the PDF structure
      const pdfHeader = buffer.toString('utf8', 0, 5);
      if (pdfHeader !== '%PDF-') {
        throw new Error('Invalid PDF format: Missing PDF header');
      }

      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer, {
        max: 0,
        pagerender: function(pageData: any) {
          return pageData.getTextContent()
            .then(function(textContent: any) {
              let text = '';
              for (let item of textContent.items) {
                text += item.str + ' ';
              }
              return text;
            });
        }
      });

      return data.text || '';
    } catch (error) {
      console.error('PDF parsing error:', error);
      
      try {
        const text = buffer.toString('utf8');
        const readableText = text.replace(/[^\x20-\x7E\n]/g, '');
        if (readableText.trim().length > 0) {
          return readableText;
        }
      } catch (fallbackError) {
        console.error('Fallback text extraction failed:', fallbackError);
      }
      
      throw new Error('Failed to extract text from PDF. Please try uploading a different file format (DOCX or TXT).');
    }
  }

  private static async extractTextFromDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private static async extractTextFromFile(buffer: Buffer, fileType: string): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return this.extractTextFromPDF(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.extractTextFromDOCX(buffer);
      case 'text/plain':
        return buffer.toString('utf-8');
      default:
        throw new Error('Unsupported file format');
    }
  }

  private static extractSkills(text: string): Skill[] {
    const skills: Skill[] = [];
    const textLower = text.toLowerCase();
    const detectedSkills = new Set<string>();

    // Look for exact matches
    for (const skill of TECHNICAL_SKILLS) {
      const skillLower = skill.toLowerCase();
      if (textLower.includes(skillLower)) {
        detectedSkills.add(skill);
        skills.push({
          name: skill,
          level: this.determineSkillLevel(textLower, skillLower),
          category: this.categorizeSkill(skill)
        });
      }
    }

    // Look for synonyms and related terms
    for (const [parentSkill, synonyms] of Object.entries(SKILL_SYNONYMS)) {
      if (!detectedSkills.has(parentSkill)) {
        const found = synonyms.some(synonym => {
          const synonymLower = synonym.toLowerCase();
          return textLower.includes(synonymLower);
        });

        if (found) {
          detectedSkills.add(parentSkill);
          skills.push({
            name: parentSkill,
            level: "intermediate",
            category: this.categorizeSkill(parentSkill)
          });
        }
      }
    }

    //Look for skills in job titles
    for (const [title, requiredSkills] of Object.entries(JOB_TITLES)) {
      if (textLower.includes(title.toLowerCase())) {
        for (const skill of requiredSkills) {
          if (!detectedSkills.has(skill)) {
            detectedSkills.add(skill);
            skills.push({
              name: skill,
              level: "intermediate",
              category: this.categorizeSkill(skill)
            });
          }
        }
      }
    }

    //Map sub-skills
    for (const parentSkill of Object.keys(MARKET_TRENDS)) {
      const synonyms = SKILL_SYNONYMS[parentSkill] || [];
      const hasSubSkill = skills.some(s =>
        s.name.toLowerCase() === parentSkill.toLowerCase() ||
        synonyms.map(syn => syn.toLowerCase()).includes(s.name.toLowerCase())
      );
      if (hasSubSkill && !skills.some(s => s.name === parentSkill)) {
        let level: "beginner" | "intermediate" | "advanced" | "expert" = "intermediate";
        const subSkillLevels = skills
          .filter(s => synonyms.map(syn => syn.toLowerCase()).includes(s.name.toLowerCase()))
          .map(s => s.level);
        if (subSkillLevels.includes("expert")) level = "expert";
        else if (subSkillLevels.includes("advanced")) level = "advanced";
        else if (subSkillLevels.includes("beginner")) level = "beginner";
        skills.push({
          name: parentSkill,
          level,
          category: this.categorizeSkill(parentSkill)
        });
      }
    }
    return skills;
  }

  private static determineSkillLevel(text: string, skill: string): "beginner" | "intermediate" | "advanced" | "expert" {
    const context = text.slice(
      Math.max(0, text.indexOf(skill) - 100),
      Math.min(text.length, text.indexOf(skill) + 100)
    );

    if (context.match(/\b(expert|advanced|senior|lead|principal|architect)\b/i)) {
      return "expert";
    } else if (context.match(/\b(intermediate|mid-level|experienced)\b/i)) {
      return "advanced";
    } else if (context.match(/\b(junior|beginner|basic|entry-level)\b/i)) {
      return "beginner";
    }
    return "intermediate";
  }

  private static categorizeSkill(skill: string): string {
    if (["Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP"].includes(skill)) {
      return "programming";
    } else if (["React", "Angular", "Vue", "HTML", "CSS"].includes(skill)) {
      return "frontend";
    } else if (["Node.js", "Express", "Django", "Flask", "Spring"].includes(skill)) {
      return "backend";
    } else if (["SQL", "MongoDB", "PostgreSQL", "MySQL"].includes(skill)) {
      return "database";
    } else if (["AWS", "Azure", "GCP", "Docker", "Kubernetes"].includes(skill)) {
      return "devops";
    } else if (["Machine Learning", "Deep Learning", "Data Science"].includes(skill)) {
      return "ai";
    }
    return "other";
  }

  private static extractExperiences(text: string): Experience[] {
    const experiences: Experience[] = [];
    const dateRegex = /(\d{4})\s*[-–]\s*(present|\d{4})/gi;
    const companyRegex = /at\s+([A-Z][A-Za-z\s]+)/gi;
    
    const sections = text.split(/\n{2,}/);
    
    for (const section of sections) {
      if (section.match(/experience|work|job|position/i)) {
        const titleMatch = section.match(/^([A-Z][A-Za-z\s]+)/);
        const companyMatch = companyRegex.exec(section);
        const dateMatch = dateRegex.exec(section);
        
        if (titleMatch && companyMatch) {
          const title = titleMatch[1].trim();
          const company = companyMatch[1].trim();
          const duration = dateMatch ? this.calculateDuration(dateMatch[1], dateMatch[2]) : 0;
          
          // Extract skills mentioned in experience section of imported cv
          const skills = Array.from(TECHNICAL_SKILLS).filter(skill => 
            new RegExp(`\\b${skill.toLowerCase()}\\b`, 'i').test(section)
          );
          
          experiences.push({
            title,
            company,
            duration,
            skills,
            description: section.split('\n').slice(1).join(' ').trim()
          });
        }
      }
    }
    
    return experiences;
  }

  private static calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = end.toLowerCase() === 'present' ? new Date() : new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  private static extractEducation(text: string): string[] {
    const education: string[] = [];
    const educationRegex = /(Bachelor|Master|PhD|BSc|MSc|MBA|B\.?E\.?|M\.?E\.?)[\s\w]+(?:University|Institute|School|College)[\s\w]+(?:\((\d{4})\))?/gi;
    
    let match;
    while ((match = educationRegex.exec(text)) !== null) {
      education.push(match[0].trim());
    }
    
    return education;
  }

  private static extractLanguages(text: string): { name: string; level: string }[] {
    const languages: { name: string; level: string }[] = [];
    const languageRegex = /(?:language|langue)s?:?\s*([^.]*)/i;
    const match = text.match(languageRegex);
    
    if (match) {
      const languageSection = match[1];
      const languageEntries = languageSection.split(',').map(entry => entry.trim());
      
      for (const entry of languageEntries) {
        const [name, level] = entry.split(/[:\-]/).map(s => s.trim());
        if (name) {
          languages.push({
            name,
            level: level || 'Intermediate'
          });
        }
      }
    }
    
    return languages;
  }

  static async extractDataFromCV(fileBuffer: Buffer, fileType: string): Promise<CVAnalysisResult> {
    try {
      const text = await this.extractTextFromFile(fileBuffer, fileType);

      console.log('Extracted CV text:', text.slice(0, 500));

      const skills = this.extractSkills(text);
      const experiences = this.extractExperiences(text);
      const education = this.extractEducation(text);
      const languages = this.extractLanguages(text);
      
      const summary = this.generateSummary(skills, experiences);
      
      return {
        skills,
        experiences,
        education,
        languages,
        summary
      };
    } catch (error) {
      console.error("Error during CV data extraction:", error);
      throw error;
    }
  }

  private static generateSummary(skills: Skill[], experiences: Experience[]): string {
    const topSkills = skills
      .filter(skill => skill.level === "expert" || skill.level === "advanced")
      .map(skill => skill.name)
      .slice(0, 5);
    
    const recentExperience = experiences[0];
    
    return `Professionnel avec ${experiences.reduce((acc, exp) => acc + exp.duration, 0) / 12} ans d'expérience en ${recentExperience?.title || 'développement'}, spécialisé dans ${topSkills.join(', ')}.`;
  }

  static async generateRecommendations(cvData: CVAnalysisResult): Promise<{
    courses: any[]
    careerPaths: any[]
    skillGaps: any[]
    allSkillGaps: any[]
    allExtractedSkills: Skill[]
    otherSkills: Skill[]
  }> {
    try {
      
      const highLevelSkills: Skill[] = [];
      const otherSkills: Skill[] = [];
      const allExtractedSkills = cvData.skills;
      const levelMap: Record<string, number> = {
        beginner: 25,
        intermediate: 50,
        advanced: 75,
        expert: 100,
      };
      const reverseLevelMap: Record<number, string> = {
        25: 'beginner',
        50: 'intermediate',
        75: 'advanced',
        100: 'expert',
      };
      for (const parentSkill of Object.keys(MARKET_TRENDS)) {
        const parentKey = parentSkill.trim().toLowerCase();
        const synonyms = (SKILL_SYNONYMS[parentSkill] || []).map(s => s.trim().toLowerCase());
        let maxLevel = 0;
        let found = false;
        for (const skill of cvData.skills) {
          if (skill.name.trim().toLowerCase() === parentKey) {
            maxLevel = Math.max(maxLevel, levelMap[skill.level]);
            found = true;
          }
        }
        for (const skill of cvData.skills) {
          if (synonyms.includes(skill.name.trim().toLowerCase())) {
            maxLevel = Math.max(maxLevel, levelMap[skill.level]);
            found = true;
          }
        }
        if (found && maxLevel > 0) {
          highLevelSkills.push({
            name: parentSkill,
            level: reverseLevelMap[maxLevel] as Skill["level"],
            category: 'high-level'
          });
        }
      }

      for (const skill of cvData.skills) {
        const isHighLevel = Object.keys(MARKET_TRENDS).some(parent => {
          const parentKey = parent.trim().toLowerCase();
          const synonyms = (SKILL_SYNONYMS[parent] || []).map(s => s.trim().toLowerCase());
          return skill.name.trim().toLowerCase() === parentKey || synonyms.includes(skill.name.trim().toLowerCase());
        });
        if (!isHighLevel) {
          otherSkills.push(skill);
        }
      }

      const skillGaps = cvData.skills.map(skill => {
        const trendKey = Object.keys(MARKET_TRENDS).find(k => k.toLowerCase() === skill.name.toLowerCase()) as keyof typeof MARKET_TRENDS | undefined;
        const trend = trendKey ? MARKET_TRENDS[trendKey] : undefined;
        const requiredLevel = trend ? (trend.demand === "high" ? 75 : 50) : 50;
        const currentLevel = levelMap[skill.level];
        const gap = requiredLevel - currentLevel;
        return {
          skill: skill.name,
          currentLevel,
          requiredLevel,
          gap,
          level: skill.level,
          priority: gap > 30 ? "high" : gap > 15 ? "medium" : "low",
          trend: trend ? (trend.growth > 30 ? "rising" : trend.growth > 20 ? "stable" : "declining") : undefined,
          marketData: trend,
        };
      });
      
      const recommendedCourses = COURSES
        .map(course => {
          const skillMatches = course.skills.filter(skill => 
            cvData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
          ).length;

          const prerequisiteMatches = course.prerequisites.filter(prereq =>
            cvData.skills.some(s => s.name.toLowerCase() === prereq.toLowerCase())
          ).length;

          const gapMatches = course.skills.filter(skill =>
            Object.keys(MARKET_TRENDS).map(s => s.toLowerCase()).includes(skill.toLowerCase())
          ).length;

          const relevance = (
            (skillMatches / course.skills.length) * 0.4 +
            (prerequisiteMatches / (course.prerequisites.length || 1)) * 0.2 +
            (gapMatches / course.skills.length) * 0.2 +
            course.marketRelevance * 0.2
          );

          return {
            ...course,
            relevance,
            matchesSkillGaps: gapMatches > 0,
            matchedSkills: course.skills.filter(skill =>
              cvData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
            ),
            missingPrerequisites: course.prerequisites.filter(prereq =>
              !cvData.skills.some(s => s.name.toLowerCase() === prereq.toLowerCase())
            ),
          };
        })
        .filter(course => course.relevance > 0.1) 
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 10);
   
      const recommendedCareerPaths = this.generateCareerPaths(cvData.skills, cvData.experiences)
        .filter(path => path.matchedSkills && path.matchedSkills.length > 0)
        .slice(0, 5);
      
      const allSkillGaps = cvData.skills.map(skill => {
        const trendKey = Object.keys(MARKET_TRENDS).find(k => k.toLowerCase() === skill.name.toLowerCase()) as keyof typeof MARKET_TRENDS | undefined;
        const trend = trendKey ? MARKET_TRENDS[trendKey] : undefined;
        const requiredLevel = trend ? (trend.demand === "high" ? 75 : 50) : 50;
        const currentLevel = levelMap[skill.level];
        const gap = requiredLevel - currentLevel;
        return {
          skill: skill.name,
          currentLevel,
          requiredLevel,
          gap,
          priority: gap > 30 ? "high" : gap > 15 ? "medium" : "low",
          trend: trend ? (trend.growth > 30 ? "rising" : trend.growth > 20 ? "stable" : "declining") : undefined,
          marketData: trend,
        };
      });
      

      return {
        courses: recommendedCourses,
        careerPaths: recommendedCareerPaths,
        skillGaps: skillGaps,
        allSkillGaps,
        allExtractedSkills,
        otherSkills,
      };
    } catch (error) {
      console.error("Error generating recommendations:", error);
      throw error;
    }
  }

  private static generateCareerPaths(skills: Skill[], experiences: Experience[]): any[] {
    const careerPaths = [];
    const skillSet = new Set(skills.map(s => s.name.toLowerCase()));
    for (const [title, requiredSkills] of Object.entries(JOB_TITLES)) {
      const matchingSkills = requiredSkills.filter(skill => 
        skillSet.has(skill.toLowerCase())
      );
      const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
      if (matchingSkills.length > 0) { 
        const missingSkills = requiredSkills.filter(skill => 
          !skillSet.has(skill.toLowerCase())
        );
        careerPaths.push({
          id: title.toLowerCase().replace(/\s+/g, '-'),
          title,
          match: `${Math.round(matchPercentage)}%`,
          description: `Basé sur vos compétences en ${matchingSkills.join(', ')}`,
          requiredSkills,
          matchedSkills: matchingSkills,
          missingSkills,
          averageSalary: this.getAverageSalary(title),
          growthRate: this.getGrowthRate(title),
        });
      }
    }
    return careerPaths.sort((a, b) => 
      parseInt(b.match) - parseInt(a.match)
    ).slice(0, 5);
  }

  private static getAverageSalary(title: string): string {
    const salaries: Record<string, string> = {
      "Software Engineer": "55 000 € - 75 000 €",
      "Data Scientist": "65 000 € - 85 000 €",
      "DevOps Engineer": "60 000 € - 80 000 €",
      "Full Stack Developer": "55 000 € - 75 000 €",
      "Data Engineer": "60 000 € - 80 000 €",
      "Machine Learning Engineer": "70 000 € - 90 000 €",
      "Cloud Engineer": "65 000 € - 85 000 €",
      "Security Engineer": "60 000 € - 80 000 €",
      "Product Manager": "65 000 € - 85 000 €",
      "UX Designer": "55 000 € - 75 000 €",
    };
    
    return salaries[title] || "50 000 € - 70 000 €";
  }

  private static getGrowthRate(title: string): string {
    const growthRates: Record<string, string> = {
      "Software Engineer": "+20% sur 5 ans",
      "Data Scientist": "+25% sur 5 ans",
      "DevOps Engineer": "+22% sur 5 ans",
      "Full Stack Developer": "+18% sur 5 ans",
      "Data Engineer": "+23% sur 5 ans",
      "Machine Learning Engineer": "+28% sur 5 ans",
      "Cloud Engineer": "+25% sur 5 ans",
      "Security Engineer": "+24% sur 5 ans",
      "Product Manager": "+20% sur 5 ans",
      "UX Designer": "+18% sur 5 ans",
    };
    
    return growthRates[title] || "+15% sur 5 ans";
  }
}
