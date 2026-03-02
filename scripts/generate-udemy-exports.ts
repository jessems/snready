#!/usr/bin/env npx tsx
/**
 * Generates Udemy-compatible CSV exports for all certifications.
 * Run: npx tsx scripts/generate-udemy-exports.ts
 * 
 * Outputs CSV files to public/exports/{cert}-questions-udemy.csv
 * These are then served as static files and linked from the admin page.
 */

import { promises as fs } from "fs";
import path from "path";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "multi_select";
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: {
    correct: string;
    wrongAnswers?: Array<{ choiceId: string; explanation: string }>;
  };
  labels?: {
    domain?: string;
  };
}

interface QuestionFile {
  questions: Question[];
}

function escapeCSV(text: string): string {
  if (!text) return "";
  // If text contains comma, newline, or quote, wrap in quotes and escape quotes
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function mapQuestionType(type: string): string {
  return type === "multi_select" ? "multi-select" : "multiple-choice";
}

function getCorrectResponseNumbers(
  options: QuestionOption[],
  correctAnswers: string[]
): string {
  // correctAnswers contains option IDs like "a", "b", "c", "d"
  // We need to convert to 1-based position numbers
  const numbers = correctAnswers.map((answerId) => {
    const index = options.findIndex((opt) => opt.id === answerId);
    return index + 1; // 1-based
  });
  return numbers.join(",");
}

function buildExplanation(question: Question): string {
  // Use the correct explanation
  let explanation = question.explanation.correct || "";
  
  // Clean up any URLs from the explanation for Udemy (they don't support links)
  explanation = explanation.replace(/See: https?:\/\/[^\s]+/g, "");
  explanation = explanation.replace(/https?:\/\/[^\s]+/g, "");
  explanation = explanation.trim();
  
  return explanation;
}

async function generateExports() {
  const questionsDir = path.join(process.cwd(), "data", "questions");
  const outputDir = path.join(process.cwd(), "public", "exports");
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all certification directories
  const certDirs = await fs.readdir(questionsDir);
  
  const results: Array<{ cert: string; questions: number; file: string }> = [];
  
  for (const cert of certDirs) {
    const certPath = path.join(questionsDir, cert);
    const stat = await fs.stat(certPath);
    
    if (!stat.isDirectory()) continue;
    if (cert.endsWith(".old")) continue; // Skip backup directories
    
    // Read all JSON files in this certification directory
    const files = await fs.readdir(certPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    
    if (jsonFiles.length === 0) continue;
    
    // Collect all questions
    const allQuestions: Question[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(certPath, file);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const data: QuestionFile = JSON.parse(content);
        
        // All files now use canonical QuestionFile format
        if (!data.questions || !Array.isArray(data.questions)) {
          console.warn(`⚠️  Skipping ${filePath}: invalid QuestionFile format`);
          continue;
        }
        
        allQuestions.push(...data.questions);
      } catch (err) {
        console.warn(`⚠️  Error reading ${filePath}:`, err);
      }
    }
    
    if (allQuestions.length === 0) continue;
    
    // Build CSV header (Udemy template format)
    const headers = [
      "Question",
      "Question Type (multiple-choice or multi-select)",
      "Answer Option 1",
      "Answer Option 2",
      "Answer Option 3",
      "Answer Option 4",
      "Answer Option 5",
      "Answer Option 6",
      "Answer Option 7",
      "Answer Option 8",
      "Answer Option 9",
      "Answer Option 10",
      "Answer Option 11",
      "Answer Option 12",
      "Answer Option 13",
      "Answer Option 14",
      "Answer Option 15",
      "Correct Response",
      "Explanation",
      "Knowledge Area",
    ];
    
    // Build CSV rows
    const rows: string[][] = [headers];
    
    for (const q of allQuestions) {
      // Fill answer options (up to 15)
      const answerOptions: string[] = [];
      for (let i = 0; i < 15; i++) {
        answerOptions.push(q.options[i]?.text || "");
      }
      
      const row = [
        q.question,
        mapQuestionType(q.type),
        ...answerOptions,
        getCorrectResponseNumbers(q.options, q.correctAnswers),
        buildExplanation(q),
        q.labels?.domain || cert.toUpperCase(),
      ];
      
      rows.push(row);
    }
    
    // Convert to CSV string
    const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
    
    // Write to file
    const outputFile = path.join(outputDir, `${cert}-questions-udemy.csv`);
    await fs.writeFile(outputFile, csv, "utf-8");
    
    results.push({
      cert,
      questions: allQuestions.length,
      file: outputFile,
    });
    
    console.log(`✅ ${cert}: ${allQuestions.length} questions → ${outputFile}`);
  }
  
  console.log(`\n📦 Generated ${results.length} Udemy export files`);
  console.log(`   Total questions: ${results.reduce((sum, r) => sum + r.questions, 0)}`);
}

generateExports().catch(console.error);
