// lib/github.ts
import { Octokit } from "@octokit/rest";

// Initialize Octokit WITH authentication to prevent rate limits
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Helper function to extract owner and repo from URL
function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }
  return { owner: match[1], repo: match[2] };
}

// Fetch repository information
export async function fetchRepositoryInfo(repoUrl: string) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.repos.get({ owner, repo });
  
  return {
    name: response.data.name,
    fullName: response.data.full_name,
    description: response.data.description || "",
    owner: response.data.owner.login,
    url: response.data.html_url,
    defaultBranch: response.data.default_branch,
    language: response.data.language,
    stars: response.data.stargazers_count,
    forks: response.data.forks_count,
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at,
  };
}

// Fetch commits since a specific SHA
export async function fetchCommitsSinceSHA(
  repoUrl: string,
  lastSHA: string
) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 100,
  });

  let commits = response.data;
  if (lastSHA) {
    const lastSHAIndex = commits.findIndex((c) => c.sha === lastSHA);
    if (lastSHAIndex !== -1) {
      commits = commits.slice(0, lastSHAIndex);
    }
  }

  return commits.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name || "Unknown",
    authorEmail: commit.commit.author?.email || "",
    timestamp: commit.commit.author?.date || "",
    url: commit.html_url,
  }));
}

// Fetch files changed in a specific commit
export async function fetchFilesChanged(
  repoUrl: string,
  commitSHA: string
) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.repos.getCommit({
    owner,
    repo,
    ref: commitSHA,
  });

  return response.data.files?.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    // TRUNCATE THE PATCH TO SAVE TOKENS!
    patch: file.patch ? file.patch.substring(0, 300) + "...[truncated]" : "",
  })) || [];
}

// Fetch user's contributions to the repository
export async function fetchUserContributions(
  repoUrl: string,
  username: string
) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.repos.listCommits({
    owner,
    repo,
    author: username,
    per_page: 100,
  });

  let totalAdditions = 0;
  let totalDeletions = 0;
  let totalCommits = response.data.length;

  for (const commit of response.data) {
    try {
      const commitDetails = await octokit.repos.getCommit({
        owner,
        repo,
        ref: commit.sha,
      });
      
      if (commitDetails.data.stats) {
        totalAdditions += commitDetails.data.stats.additions || 0;
        totalDeletions += commitDetails.data.stats.deletions || 0;
      }
    } catch (error) {
      // Skip if we can't fetch commit details
    }
  }

  return {
    username,
    totalCommits,
    totalAdditions,
    totalDeletions,
    commits: response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      timestamp: commit.commit.author?.date || "",
    })),
  };
}

// Fetch pull requests
export async function fetchPullRequests(repoUrl: string) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.pulls.list({
    owner,
    repo,
    per_page: 100,
    state: "all",
  });

  return response.data.map((pr) => ({
    number: pr.number,
    title: pr.title,
    state: pr.state,
    author: pr.user?.login || "Unknown",
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    mergedAt: pr.merged_at,
    url: pr.html_url,
  }));
}

// Fetch issues
export async function fetchIssues(repoUrl: string) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  const response = await octokit.issues.listForRepo({
    owner,
    repo,
    per_page: 100,
    state: "all",
  });

  return response.data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    author: issue.user?.login || "Unknown",
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,
    url: issue.html_url,
    labels: issue.labels.map((label: any) => 
      typeof label === "string" ? label : (label as any).name
    ),
  }));
}

// Main function to fetch all data and structure it
export async function fetchGitHubData(
  repoUrl: string,
  username: string,
  lastSHA: string = ""
) {
  try {
    const [
      repoInfo,
      commits,
      userContributions,
      pullRequests,
      issues,
    ] = await Promise.all([
      fetchRepositoryInfo(repoUrl),
      fetchCommitsSinceSHA(repoUrl, lastSHA),
      fetchUserContributions(repoUrl, username),
      fetchPullRequests(repoUrl),
      fetchIssues(repoUrl),
    ]);

    const recentCommits = commits.slice(0, 2);
    const filesChangedPromises = recentCommits.map((commit) =>
      fetchFilesChanged(repoUrl, commit.sha)
    );
    const filesChangedResults = await Promise.all(filesChangedPromises);

    const allFilesChanged = filesChangedResults.flat();

    const totalAdditionsFromFiles = allFilesChanged.reduce((sum, file) => sum + (file.additions || 0), 0);
    const totalDeletionsFromFiles = allFilesChanged.reduce((sum, file) => sum + (file.deletions || 0), 0);

    const structuredData = {
      repository: repoInfo,
      commits: {
        total: commits.length,
        since: lastSHA || "beginning",
        list: commits,
      },
      filesChanged: {
        total: allFilesChanged.length,
        files: allFilesChanged,
      },
      userContributions: userContributions,
      pullRequests: {
        total: pullRequests.length,
        list: pullRequests,
      },
      issues: {
        total: issues.length,
        list: issues,
      },
      summary: {
        totalCommits: commits.length,
        totalFilesChanged: allFilesChanged.length,
        totalAdditions: totalAdditionsFromFiles,
        totalDeletions: totalDeletionsFromFiles,
        openPRs: pullRequests.filter((pr) => pr.state === "open").length,
        openIssues: issues.filter((issue) => issue.state === "open").length,
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        username,
        lastSHA,
      },
    };

    return structuredData;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}