'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, FileText, Loader2, Upload, AlertCircle } from "lucide-react";
import { RecommendationsDisplay } from "./recommendations-display";

export function CVUploadAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<
    "idle" | "uploading" | "extracting" | "analyzing" | "complete" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setAnalysisStage("idle");
    setAnalysisResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setAnalysisStage("uploading");
    setError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/cv-analysis", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Statut ${res.status}: ${txt}`);
      }

      setAnalysisStage("extracting");
      const { cvData, recommendations } = await res.json();

      setAnalysisStage("analyzing");
      await new Promise((r) => setTimeout(r, 300));

      setAnalysisResult({ cvData, recommendations });
      setAnalysisStage("complete");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error during analysis");
      setAnalysisStage("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><FileText className="inline w-5 h-5 mr-2"/>CV Analysis</CardTitle>
        <CardDescription>
          Upload your CV to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/> <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisStage === "idle" && (
          <>
            <div
              className="border-2 border-dashed rounded p-6 text-center cursor-pointer"
              onClick={() => document.getElementById("cv-upload")?.click()}
            >
              <Upload className="mx-auto w-8 h-8 mb-2 text-muted-foreground"/>
              <p>Drag and drop or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
              <Button variant="outline" className="mt-3">Browse</Button>
              <input
                type="file"
                id="cv-upload"
                name="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {file && (
              <div className="p-4 bg-slate-50 rounded-md border">
                <p><strong>File ready:</strong> {file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex justify-end mt-2">
                  <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Processing…" : "Analyze my CV"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {analysisStage === "uploading" && (
          <div className="flex items-center space-x-2 px-4 py-2">
            <Loader2 className="animate-spin h-5 w-5 text-primary" />
            <p>Uploading in progress…</p>
          </div>
        )}

        {(analysisStage === "extracting" || analysisStage === "analyzing") && (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto h-8 w-8 mb-2"/>
            <p>{analysisStage === "extracting" ? "Extracting…" : "Analyzing…"}</p>
          </div>
        )}

        {analysisStage === "complete" && analysisResult && (
          <>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500"/>
              <AlertTitle>Analysis Complete</AlertTitle>
              <AlertDescription>
                Here are your personalized recommendations.
              </AlertDescription>
            </Alert>

            <RecommendationsDisplay recommendations={analysisResult.recommendations} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
