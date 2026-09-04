module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/github/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// app/api/github/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/github.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { repoUrl, username, lastSHA } = body;
        // Validate inputs
        if (!repoUrl || !username) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Repository URL and username are required'
            }, {
                status: 400
            });
        }
        // Fetch GitHub data
        const githubData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchGitHubData"])(repoUrl, username, lastSHA || '');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: githubData
        });
    } catch (error) {
        console.error('Error in GitHub API route:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch GitHub data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/github.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCommitsSinceSHA",
    ()=>fetchCommitsSinceSHA,
    "fetchFilesChanged",
    ()=>fetchFilesChanged,
    "fetchGitHubData",
    ()=>fetchGitHubData,
    "fetchIssues",
    ()=>fetchIssues,
    "fetchPullRequests",
    ()=>fetchPullRequests,
    "fetchRepositoryInfo",
    ()=>fetchRepositoryInfo,
    "fetchUserContributions",
    ()=>fetchUserContributions
]);
// lib/github.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$octokit$2f$rest$2f$dist$2d$web$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@octokit/rest/dist-web/index.js [app-route] (ecmascript)");
;
// Initialize Octokit without authentication (rate limit: 60 req/hour)
const octokit = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$octokit$2f$rest$2f$dist$2d$web$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Octokit"]();
// Helper function to extract owner and repo from URL
function parseRepoUrl(repoUrl) {
    const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) {
        throw new Error("Invalid GitHub repository URL");
    }
    return {
        owner: match[1],
        repo: match[2]
    };
}
async function fetchRepositoryInfo(repoUrl) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.repos.get({
        owner,
        repo
    });
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
        updatedAt: response.data.updated_at
    };
}
async function fetchCommitsSinceSHA(repoUrl, lastSHA) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: 100
    });
    let commits = response.data;
    if (lastSHA) {
        const lastSHAIndex = commits.findIndex((c)=>c.sha === lastSHA);
        if (lastSHAIndex !== -1) {
            commits = commits.slice(0, lastSHAIndex);
        }
    }
    return commits.map((commit)=>({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author?.name || "Unknown",
            authorEmail: commit.commit.author?.email || "",
            timestamp: commit.commit.author?.date || "",
            url: commit.html_url
        }));
}
async function fetchFilesChanged(repoUrl, commitSHA) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.repos.getCommit({
        owner,
        repo,
        ref: commitSHA
    });
    return response.data.files?.map((file)=>({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            patch: file.patch || ""
        })) || [];
}
async function fetchUserContributions(repoUrl, username) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.repos.listCommits({
        owner,
        repo,
        author: username,
        per_page: 100
    });
    let totalAdditions = 0;
    let totalDeletions = 0;
    let totalCommits = response.data.length;
    for (const commit of response.data){
        try {
            const commitDetails = await octokit.repos.getCommit({
                owner,
                repo,
                ref: commit.sha
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
        commits: response.data.map((commit)=>({
                sha: commit.sha,
                message: commit.commit.message,
                timestamp: commit.commit.author?.date || ""
            }))
    };
}
async function fetchPullRequests(repoUrl) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.pulls.list({
        owner,
        repo,
        per_page: 100,
        state: "all"
    });
    return response.data.map((pr)=>({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            author: pr.user?.login || "Unknown",
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            mergedAt: pr.merged_at,
            url: pr.html_url
        }));
}
async function fetchIssues(repoUrl) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const response = await octokit.issues.listForRepo({
        owner,
        repo,
        per_page: 100,
        state: "all"
    });
    return response.data.map((issue)=>({
            number: issue.number,
            title: issue.title,
            state: issue.state,
            author: issue.user?.login || "Unknown",
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            closedAt: issue.closed_at,
            url: issue.html_url,
            labels: issue.labels.map((label)=>typeof label === "string" ? label : label.name)
        }));
}
async function fetchGitHubData(repoUrl, username, lastSHA = "") {
    try {
        const [repoInfo, commits, userContributions, pullRequests, issues] = await Promise.all([
            fetchRepositoryInfo(repoUrl),
            fetchCommitsSinceSHA(repoUrl, lastSHA),
            fetchUserContributions(repoUrl, username),
            fetchPullRequests(repoUrl),
            fetchIssues(repoUrl)
        ]);
        const recentCommits = commits.slice(0, 5);
        const filesChangedPromises = recentCommits.map((commit)=>fetchFilesChanged(repoUrl, commit.sha));
        const filesChangedResults = await Promise.all(filesChangedPromises);
        const allFilesChanged = filesChangedResults.flat();
        const totalAdditionsFromFiles = allFilesChanged.reduce((sum, file)=>sum + (file.additions || 0), 0);
        const totalDeletionsFromFiles = allFilesChanged.reduce((sum, file)=>sum + (file.deletions || 0), 0);
        const structuredData = {
            repository: repoInfo,
            commits: {
                total: commits.length,
                since: lastSHA || "beginning",
                list: commits
            },
            filesChanged: {
                total: allFilesChanged.length,
                files: allFilesChanged
            },
            userContributions: userContributions,
            pullRequests: {
                total: pullRequests.length,
                list: pullRequests
            },
            issues: {
                total: issues.length,
                list: issues
            },
            summary: {
                totalCommits: commits.length,
                totalFilesChanged: allFilesChanged.length,
                totalAdditions: totalAdditionsFromFiles,
                totalDeletions: totalDeletionsFromFiles,
                openPRs: pullRequests.filter((pr)=>pr.state === "open").length,
                openIssues: issues.filter((issue)=>issue.state === "open").length
            },
            metadata: {
                fetchedAt: new Date().toISOString(),
                username,
                lastSHA
            }
        };
        return structuredData;
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        throw error;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__129nfvv._.js.map