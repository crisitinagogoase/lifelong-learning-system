export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { CVAnalysisService } from "@/lib/services/cv-analysis-service";  

import type {
  CVAnalysisResult,
} from "@/lib/services/cv-analysis-service";

export async function POST(request: NextRequest) {
  try {
    // 1) Parse incoming form & file
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file provided or invalid file format" },
        { status: 400 }
      );
    }

    // 2) Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    // Validate file type
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType)) {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Additional PDF validation for PDF files
    if (fileType === 'application/pdf') {
      // Check if the file starts with %PDF- header
      const pdfHeader = buffer.toString('utf8', 0, 5);
      if (pdfHeader !== '%PDF-') {
        return NextResponse.json(
          { error: "Invalid PDF file format. The file appears to be corrupted or not a valid PDF." },
          { status: 400 }
        );
      }

      // Check file size (minimum 100 bytes to be a valid PDF)
      if (buffer.length < 100) {
        return NextResponse.json(
          { error: "Invalid PDF file. The file is too small to be a valid PDF." },
          { status: 400 }
        );
      }
    }

    // 3) Extract structured CV data
    let cvResult: CVAnalysisResult;
    try {
      cvResult = await CVAnalysisService.extractDataFromCV(buffer, fileType);
    } catch (error) {
      console.error("Error extracting CV data:", error);
      return NextResponse.json(
        { error: "Failed to extract data from the CV. Please ensure the file is not corrupted." },
        { status: 400 }
      );
    }

    // 4) Generate personalized recommendations
    let recommendations;
    try {
      recommendations = await CVAnalysisService.generateRecommendations(cvResult);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return NextResponse.json(
        { error: "Failed to generate recommendations. Please try again." },
        { status: 500 }
      );
    }

    // 5) Return everything to the client
    return NextResponse.json({
      cvData: cvResult,
      recommendations: recommendations,
    });
  } catch (err) {
    console.error("Error during CV analysis:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error during CV analysis" },
      { status: 500 }
    );
  }
}
