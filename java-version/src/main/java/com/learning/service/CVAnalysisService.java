package com.learning.service;

import com.learning.model.CVAnalysisResult;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CVAnalysisService {

    private static final Set<String> TECHNICAL_SKILLS = Set.of(
        "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
        "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring",
        "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
        "Git", "CI/CD", "Jenkins", "GitLab", "GitHub Actions",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
        "Data Science", "Data Analysis", "Big Data", "Hadoop", "Spark",
        "DevOps", "SRE", "Linux", "Networking", "Security",
        "Agile", "Scrum", "Project Management", "JIRA", "Confluence"
    );

    private static final Map<String, List<String>> SKILL_SYNONYMS = Map.of(
        "DevOps", List.of("CI/CD", "Continuous Integration", "Docker", "Kubernetes"),
        "Data Engineering", List.of("ETL", "Data Pipeline", "Big Data", "Spark", "Hadoop"),
        "Full Stack Development", List.of("Frontend", "Backend", "React", "Node.js", "JavaScript"),
        "AI/ML", List.of("Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"),
        "Cloud Computing", List.of("AWS", "Azure", "GCP", "Cloud Infrastructure")
    );

    public CVAnalysisResult analyzeCV(MultipartFile file) throws Exception {
        String text = extractText(file);
        return parseCVData(text);
    }

    private String extractText(MultipartFile file) throws Exception {
        String contentType = file.getContentType();
        InputStream inputStream = file.getInputStream();

        if (contentType != null && contentType.equals("application/pdf")) {
            return extractTextFromPDF(inputStream);
        } else if (contentType != null && contentType.contains("wordprocessingml")) {
            return extractTextFromDOCX(inputStream);
        } else if (contentType != null && contentType.equals("text/plain")) {
            return new String(inputStream.readAllBytes());
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload PDF or DOCX.");
        }
    }

    private String extractTextFromPDF(InputStream inputStream) throws Exception {
        PDDocument document = null;
        try {
            document = PDDocument.load(inputStream.readAllBytes());
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } finally {
            if (document != null) {
                document.close();
            }
        }
    }

    private String extractTextFromDOCX(InputStream inputStream) throws Exception {
        XWPFDocument document = null;
        XWPFWordExtractor extractor = null;
        try {
            document = new XWPFDocument(inputStream);
            extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        } finally {
            if (extractor != null) {
                extractor.close();
            }
            if (document != null) {
                document.close();
            }
        }
    }

    private CVAnalysisResult parseCVData(String text) {
        CVAnalysisResult result = new CVAnalysisResult();
        String textLower = text.toLowerCase();

        // Extract skills
        List<CVAnalysisResult.Skill> skills = extractSkills(text, textLower);
        result.setSkills(skills);

        // Extract experiences
        List<CVAnalysisResult.Experience> experiences = extractExperiences(text);
        result.setExperiences(experiences);

        // Extract education
        List<String> education = extractEducation(text);
        result.setEducation(education);

        // Extract languages
        List<CVAnalysisResult.Language> languages = extractLanguages(text);
        result.setLanguages(languages);

        // Generate summary
        String summary = generateSummary(skills, experiences);
        result.setSummary(summary);

        return result;
    }

    private List<CVAnalysisResult.Skill> extractSkills(String text, String textLower) {
        List<CVAnalysisResult.Skill> skills = new ArrayList<>();
        Set<String> detectedSkills = new HashSet<>();

        // Exact matches
        for (String skill : TECHNICAL_SKILLS) {
            if (textLower.contains(skill.toLowerCase())) {
                detectedSkills.add(skill);
                String level = determineSkillLevel(textLower, skill.toLowerCase());
                String category = categorizeSkill(skill);
                skills.add(new CVAnalysisResult.Skill(skill, level, category));
            }
        }

        // Synonym matches
        for (Map.Entry<String, List<String>> entry : SKILL_SYNONYMS.entrySet()) {
            String parentSkill = entry.getKey();
            if (!detectedSkills.contains(parentSkill)) {
                boolean found = entry.getValue().stream()
                    .anyMatch(synonym -> textLower.contains(synonym.toLowerCase()));
                if (found) {
                    detectedSkills.add(parentSkill);
                    skills.add(new CVAnalysisResult.Skill(parentSkill, "intermediate", "other"));
                }
            }
        }

        return skills;
    }

    private String determineSkillLevel(String text, String skill) {
        int index = text.indexOf(skill);
        if (index == -1) return "intermediate";
        
        String context = text.substring(Math.max(0, index - 100), 
                                        Math.min(text.length(), index + 100)).toLowerCase();
        
        if (context.matches(".*\\b(expert|advanced|senior|lead|principal|architect)\\b.*")) {
            return "expert";
        } else if (context.matches(".*\\b(intermediate|mid-level|experienced)\\b.*")) {
            return "advanced";
        } else if (context.matches(".*\\b(junior|beginner|basic|entry-level)\\b.*")) {
            return "beginner";
        }
        return "intermediate";
    }

    private String categorizeSkill(String skill) {
        if (Arrays.asList("Python", "JavaScript", "Java", "C++", "C#").contains(skill)) {
            return "programming";
        } else if (Arrays.asList("React", "Angular", "Vue", "HTML", "CSS").contains(skill)) {
            return "frontend";
        } else if (Arrays.asList("Node.js", "Express", "Django", "Flask").contains(skill)) {
            return "backend";
        } else if (Arrays.asList("SQL", "MongoDB", "PostgreSQL").contains(skill)) {
            return "database";
        } else if (Arrays.asList("AWS", "Azure", "Docker", "Kubernetes").contains(skill)) {
            return "devops";
        } else if (Arrays.asList("Machine Learning", "Data Science").contains(skill)) {
            return "ai";
        }
        return "other";
    }

    private List<CVAnalysisResult.Experience> extractExperiences(String text) {
        List<CVAnalysisResult.Experience> experiences = new ArrayList<>();
        Pattern datePattern = Pattern.compile("(\\d{4})\\s*[-–]\\s*(present|\\d{4})", Pattern.CASE_INSENSITIVE);
        
        String[] sections = text.split("\\n\\n+");
        for (String section : sections) {
            if (section.toLowerCase().contains("experience") || 
                section.toLowerCase().contains("work") ||
                section.toLowerCase().contains("employment")) {
                
                java.util.regex.Matcher dateMatcher = datePattern.matcher(section);
                if (dateMatcher.find()) {
                    CVAnalysisResult.Experience exp = new CVAnalysisResult.Experience();
                    exp.setDescription(section);
                    exp.setDuration(12); // Default
                    experiences.add(exp);
                }
            }
        }
        return experiences;
    }

    private List<String> extractEducation(String text) {
        List<String> education = new ArrayList<>();
        Pattern eduPattern = Pattern.compile(
            "(Bachelor|Master|PhD|BSc|MSc|MBA)[\\s\\w]+(?:University|Institute|School|College)[\\s\\w]+(?:\\((\\d{4})\\))?",
            Pattern.CASE_INSENSITIVE
        );
        
        java.util.regex.Matcher matcher = eduPattern.matcher(text);
        while (matcher.find()) {
            education.add(matcher.group());
        }
        return education;
    }

    private List<CVAnalysisResult.Language> extractLanguages(String text) {
        List<CVAnalysisResult.Language> languages = new ArrayList<>();
        Pattern langPattern = Pattern.compile("(?:language|langue)s?:?\\s*([^.]*)", Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher matcher = langPattern.matcher(text);
        
        if (matcher.find()) {
            String langSection = matcher.group(1);
            String[] entries = langSection.split(",");
            for (String entry : entries) {
                String[] parts = entry.trim().split("[:\\-]");
                if (parts.length > 0) {
                    languages.add(new CVAnalysisResult.Language(
                        parts[0].trim(),
                        parts.length > 1 ? parts[1].trim() : "Intermediate"
                    ));
                }
            }
        }
        return languages;
    }

    private String generateSummary(List<CVAnalysisResult.Skill> skills, 
                                   List<CVAnalysisResult.Experience> experiences) {
        long totalMonths = experiences.stream()
            .mapToInt(e -> e.getDuration() != null ? e.getDuration() : 0)
            .sum();
        int years = (int) (totalMonths / 12);
        
        List<String> topSkills = skills.stream()
            .filter(s -> Arrays.asList("expert", "advanced").contains(s.getLevel()))
            .map(CVAnalysisResult.Skill::getName)
            .limit(5)
            .collect(Collectors.toList());
        
        return String.format("Professional with %d years of experience, specialized in %s.",
            years, String.join(", ", topSkills));
    }
}
