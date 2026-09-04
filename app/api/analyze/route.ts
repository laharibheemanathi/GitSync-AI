// lib/codespectra.ts
// GitSync AI - CodeSpectra Integration for Security & Code Analysis

export interface CodeSpectraAnalysis {
  security_issues: SecurityIssue[];
  code_quality: CodeQuality;
  vulnerabilities: Vulnerability[];
}

export interface SecurityIssue {
  severity: 'high' | 'medium' | 'low';
  type: string;
  message: string;
  line_number?: number;
  file_path?: string;
}

export interface CodeQuality {
  score: number;
  maintainability: string;
  complexity: string;
}

export interface Vulnerability {
  cve_id?: string;
  severity: string;
  description: string;
  affected_code: string;
}

/**
 * Analyze code diff using CodeSpectra API
 * @param diffText - The git diff text to analyze
 * @param filePath - The file path being analyzed
 * @returns CodeSpectraAnalysis results
 */
export async function analyzeWithCodeSpectra(
  diffText: string,
  filePath: string
): Promise<CodeSpectraAnalysis> {
  try {
    // TODO: Replace with actual CodeSpectra API endpoint when available
    // const response = await fetch('https://api.codespectra.ai/analyze', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.CODESPECTRA_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     diff: diffText,
    //     file_path: filePath
    //   })
    // });
    // return await response.json();

    // Fallback: Heuristic analysis (for hackathon demo)
    return performHeuristicAnalysis(diffText, filePath);
  } catch (error) {
    console.error('CodeSpectra API error:', error);
    return performHeuristicAnalysis(diffText, filePath);
  }
}

/**
 * Fallback heuristic analysis when CodeSpectra API is unavailable
 */
function performHeuristicAnalysis(
  diffText: string,
  filePath: string
): CodeSpectraAnalysis {
  const security_issues: SecurityIssue[] = [];
  const vulnerabilities: Vulnerability[] = [];

  // Check for removed authentication
  if (/-\s*.*(?:is_authenticated|check_auth|middleware|PermissionError)/i.test(diffText)) {
    security_issues.push({
      severity: 'high',
      type: 'Authentication Bypass',
      message: 'Authentication check or middleware appears to be removed',
      file_path: filePath
    });
  }

  // Check for hardcoded secrets
  if (/\+\s*.*(?:api_key|password|secret|token)\s*=\s*["'][^"']+["']/i.test(diffText)) {
    security_issues.push({
      severity: 'high',
      type: 'Hardcoded Secret',
      message: 'Potential hardcoded secret or API key detected',
      file_path: filePath
    });
  }

  // Check for SQL injection risks
  if (/\+\s*.*(?:execute|query|SELECT.*FROM)/i.test(diffText) && 
      !/\?\s*=/.test(diffText)) {
    security_issues.push({
      severity: 'medium',
      type: 'SQL Injection Risk',
      message: 'SQL query without parameterized inputs detected',
      file_path: filePath
    });
  }

  // Check for eval() usage
  if (/\+\s*.*eval\s*\(/i.test(diffText)) {
    security_issues.push({
      severity: 'high',
      type: 'Dangerous Function',
      message: 'Use of eval() detected - potential code injection risk',
      file_path: filePath
    });
  }

  // Calculate code quality score (simple heuristic)
  const addedLines = (diffText.match(/^\+/g) || []).length;
  const removedLines = (diffText.match(/^-/g) || []).length;
  const totalChanges = addedLines + removedLines;
  
  const codeQuality: CodeQuality = {
    score: Math.max(0, 100 - totalChanges * 2),
    maintainability: totalChanges > 50 ? 'low' : totalChanges > 20 ? 'medium' : 'high',
    complexity: totalChanges > 100 ? 'high' : totalChanges > 30 ? 'medium' : 'low'
  };

  return {
    security_issues,
    code_quality: codeQuality,
    vulnerabilities
  };
}

/**
 * Batch analyze multiple files
 */
export async function analyzeMultipleFiles(
  files: Array<{ diff: string; path: string }>
): Promise<Record<string, CodeSpectraAnalysis>> {
  const results: Record<string, CodeSpectraAnalysis> = {};
  
  for (const file of files) {
    results[file.path] = await analyzeWithCodeSpectra(file.diff, file.path);
  }
  
  return results;
}