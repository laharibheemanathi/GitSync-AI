// lib/analyzer.ts
// GitSync AI - Code, Dependency & Security Analysis Engine

export interface Commit {
  file: string;
  author: string;
  lines_changed: {
    start: number;
    end: number;
  };
  diff_text: string;
}

export interface AnalysisResult {
  conflict_risks: string[];
  security_risks: string[];
  dependency_impacts: string[];
}

const DEPENDENCY_MAP: Record<string, string[]> = {
  "backend/auth.py": ["frontend/dashboard.jsx", "backend/api.py"],
  "backend/db.py": ["backend/auth.py", "backend/api.py"],
  "backend/api.py": ["frontend/dashboard.jsx"]
};

export function analyzeCodebase(commits: Commit[]): AnalysisResult {
  const results: AnalysisResult = {
    conflict_risks: [],
    security_risks: [],
    dependency_impacts: []
  };

  // Group changes by file
  const fileChanges: Record<string, Commit[]> = {};
  commits.forEach(commit => {
    if (!fileChanges[commit.file]) {
      fileChanges[commit.file] = [];
    }
    fileChanges[commit.file].push(commit);
  });

  // Analyze each file
  for (const [file, changes] of Object.entries(fileChanges)) {
    
    // A. CONFLICT RISK ALGORITHM
    if (changes.length > 1) {
      for (let i = 0; i < changes.length; i++) {
        for (let j = i + 1; j < changes.length; j++) {
          const A = changes[i];
          const B = changes[j];
          if (A.author !== B.author) {
            // Check for overlapping lines
            if (A.lines_changed.start <= B.lines_changed.end && 
                A.lines_changed.end >= B.lines_changed.start) {
              results.conflict_risks.push(
                `[CONFLICT] ${A.author} and ${B.author} have overlapping edits in ${file} ` +
                `(Lines ${A.lines_changed.start}-${A.lines_changed.end} & ${B.lines_changed.start}-${B.lines_changed.end})`
              );
            }
          }
        }
      }
    }

    // B. SECURITY RISK DETECTION
    changes.forEach(change => {
      // Flag removed authentication
      if (/is_authenticated|check_auth|PermissionError|middleware/i.test(change.diff_text)) {
        results.security_risks.push(
          `[SECURITY] Authentication check removed or bypassed in ${change.file} by ${change.author}`
        );
      }
      // Flag hardcoded secrets
      if (/api_key|password|secret|token/i.test(change.diff_text)) {
        results.security_risks.push(
          `[SECURITY] Potential hardcoded secret detected in ${change.file}`
        );
      }
    });

    // C. DEPENDENCY MAPPING
    if (DEPENDENCY_MAP[file]) {
      const affected = DEPENDENCY_MAP[file].join(", ");
      results.dependency_impacts.push(
        `[DEPENDENCY] Changes in ${file} may break: ${affected}. Frontend/API contract sync required`
      );
    }
  }

  return results;
}