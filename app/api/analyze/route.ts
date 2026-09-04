// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.FEATHERLESS_API_KEY,
  baseURL: process.env.FEATHERLESS_BASE_URL,
});

// Helper function to clean AI responses (removes markdown code blocks)
function cleanJsonResponse(content: string): string {
  return content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

// Helper function to calculate risk level
function calculateRiskLevel(fileData: any): string {
  if (fileData.securityConcerns && fileData.securityConcerns !== 'None' && fileData.securityConcerns !== 'No immediate security concerns') {
    return 'high';
  }
  if (fileData.impactedFiles && fileData.impactedFiles.length > 2) {
    return 'high';
  }
  if (fileData.impactedFiles && fileData.impactedFiles.length > 0) {
    return 'medium';
  }
  return 'low';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubData, userRole, userName } = body;
    const files = githubData.filesChanged.files;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files found to analyze" }, { status: 400 });
    }

    // 1. Chunk the files into batches of 5 to avoid token limits
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < files.length; i += chunkSize) {
      chunks.push(files.slice(i, i + chunkSize));
    }

    let allFileAnalyses: any[] = [];

    // 2. PASS 1: Analyze each chunk individually
    for (const chunk of chunks) {
      const chunkPrompt = chunk.map((file: any) => `
### File: ${file.filename}
**Status:** ${file.status} | **Changes:** +${file.additions} -${file.deletions}
**Code Diff Preview:**
${file.patch ? file.patch.substring(0, 800) : 'No diff available'}
`).join('\n\n');

      const analysisResponse = await openai.chat.completions.create({
        model: process.env.FEATHERLESS_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert code reviewer. Analyze the provided files. You MUST output strictly as a JSON object with a "files" key containing an array. Format: { "files": [{"fileName": "...", "summary": "...", "prioritizedChanges": ["..."], "allChanges": ["..."], "securityConcerns": "..."}] }` 
          },
          { role: 'user', content: chunkPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const rawContent = analysisResponse.choices[0].message.content || '{"files": []}';
      const cleanedContent = cleanJsonResponse(rawContent);

      try {
        const parsedChunk = JSON.parse(cleanedContent);
        let chunkArray = parsedChunk.files || (Array.isArray(parsedChunk) ? parsedChunk : []);
        
        // GUARANTEE: Add status and riskLevel to every AI-generated file object
        chunkArray = chunkArray.map((fileData: any, idx: number) => ({
          ...fileData,
          fileName: fileData.fileName || chunk[idx]?.filename || "Unknown File",
          status: chunk[idx]?.status || "modified",
          riskLevel: calculateRiskLevel(fileData)
        }));
        
        allFileAnalyses.push(...chunkArray);
      } catch (parseError) {
        console.error("❌ Failed to parse AI response, using fallback:");
        
        // Fallback: Create basic summaries for each file in the chunk
        chunk.forEach((file: any) => {
          const fallbackData = {
            fileName: file.filename,
            status: file.status,
            summary: `File was ${file.status} with +${file.additions} / -${file.deletions} changes.`,
            prioritizedChanges: [`Changed ${file.additions} lines, deleted ${file.deletions} lines`],
            allChanges: [`Status: ${file.status}`, `Additions: ${file.additions}`, `Deletions: ${file.deletions}`],
            securityConcerns: "None",
            impactedFiles: [],
            impactSnippet: file.patch ? file.patch.substring(0, 150) + "..." : "No code snippet available.",
            impactReason: "Automated fallback analysis."
          };
          
          allFileAnalyses.push({
            ...fallbackData,
            riskLevel: calculateRiskLevel(fallbackData)
          });
        });
      }
    }

    // 3. PASS 2: Map Dependencies (Send only the file names and summaries)
    const fileListForDeps = allFileAnalyses.map((f: any) => f.fileName).join(', ');
    
    const dependencyPrompt = `
Here is a list of files changed in a repository: ${fileListForDeps}

Based on standard programming dependencies (imports, requires, function calls), map which files impact which. 
Output strictly as a JSON object: 
{ 
  "criticalDependencies": [
    {
      "sourceFile": "FileA.js",
      "targetFile": "FileB.js", 
      "sourceCode": "import { config } from './config'",
      "targetCode": "export const config = {...}",
      "reason": "FileA imports config from FileB"
    }
  ]
}`;

    const depResponse = await openai.chat.completions.create({
      model: process.env.FEATHERLESS_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: 'You are an expert software architect. Output strictly as JSON.' },
        { role: 'user', content: dependencyPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const rawDepContent = depResponse.choices[0].message.content || '{"criticalDependencies": []}';
    const cleanedDepContent = cleanJsonResponse(rawDepContent);
    const depData = JSON.parse(cleanedDepContent);

    // 4. Merge dependency data back into the file analyses (FIXED FOR OBJECTS)
    allFileAnalyses = allFileAnalyses.map((file: any) => {
      // Find dependencies where THIS file is the source
      const dependencies = (depData.criticalDependencies || []).filter((dep: any) => dep.sourceFile === file.fileName);
      
      const impactedFiles = dependencies.map((dep: any) => dep.targetFile);
      
      // Create a readable snippet for the UI
      const impactSnippet = dependencies.length > 0 
        ? dependencies.map((dep: any) => `// In ${file.fileName}\n${dep.sourceCode || '...'}\n// 👇 Impacts: ${dep.targetFile}\n`).join('\n')
        : "No direct impacts detected.";
        
      const impactReason = dependencies.length > 0
        ? dependencies.map((dep: any) => dep.reason).join('; ')
        : "None";

      return { 
        ...file, 
        impactedFiles: impactedFiles,
        impactSnippet: impactSnippet,
        impactReason: impactReason
      };
    });

    // Format critical dependencies for the top-level summary
    const formattedDependencies = (depData.criticalDependencies || []).map((dep: any) => 
      `${dep.sourceFile} ➔ ${dep.targetFile} (${dep.reason})`
    );

    return NextResponse.json({
      success: true,
      data: {
        overallProjectSummary: `Analyzed ${allFileAnalyses.length} changed files for ${userName}.`,
        criticalDependencies: formattedDependencies,
        files: allFileAnalyses
      }
    });

  } catch (error: any) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze data" }, { status: 500 });
  }
}