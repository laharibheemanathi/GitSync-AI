# 🚀 GitSync AI
### *Your AI-Powered GitHub Project Continuity Companion*

**HackWave 3.0 @ SNIST**)

---

## 💡 Problem & Solution
Developers waste hours deciphering commit histories to understand how recent changes affect their specific module. **GitSync AI** is a multi-step decision-making system that analyzes repository evolution, developer context, and code diffs to tell you exactly **what changed, why it matters to your role, what is at risk, and what to do next.**

---

##  Mandatory AI Stack Integration
*GitSync AI meaningfully integrates all three provided platforms in a coordinated pipeline:*

| AI Tool | Specific Role in Our Pipeline |
| :--- | :--- |
| **Featherless AI** | **Reasoning Engine:** Processes structured GitHub data to generate personalized impact analysis and structured JSON catch-up summaries of each changed files. |
| **CodeSpectra** | **Code Analysis:** Scans file diffs to detect security regressions and map file-to-file dependencies *before* LLM reasoning. |

---

## 🔄 System Workflow
1. **Fetch & Structure:** Next.js backend fetches raw GitHub API data and compacts it into a highly efficient JSON payload.
2. **Code Analysis:** CodeSpectra scans the diffs to flag security vulnerabilities and identify overlapping line modifications.
3. **AI Reasoning:** Featherless AI receives the structured data and risk flags to infer personalized impact based on the user's role.
---

##  File Structure & Functions

**Backend & API Layer**
* **`app/api/github/route.ts`**: Fetches commits, file diffs, and PRs, structuring raw data into a compact, AI-ready JSON format.
* **`app/api/analyze/route.ts`**: The central orchestration endpoint that routes structured data through the multi-step AI pipeline.

**Logic & Configuration Layer**
* **`lib/prompts.ts`**: Contains strict, schema-enforced system prompts ensuring the AI makes data-driven decisions without hallucinations.
* **`lib/codespectra.ts`**: Helper functions for code-level diff analysis, scanning for security patterns and mapping dependencies.
* **`.env.local`**: Securely stores sensitive environment variables and API keys (excluded from version control).

**Frontend Layer**
* **`public/frontend/index.html`**: The main user interface structure for input, loading states, and result visualization.
* **`public/frontend/style.css`**: Defines the responsive, modern styling and color-coded risk indicators.
* **`public/frontend/app.js`**: Manages frontend state, input validation, and orchestrates asynchronous API calls.

**Resilience Layer**
* **`data/demo_fallback.json`**: A pre-computed dataset ensuring the demo flow works flawlessly even if external API rate limits occur.

---

## ✨ Key Features
* **Role-Based Catch-Up:** Filters noise based on the developer's selected module (Backend, Frontend, ML, etc.).
* **Dependency Mapping:** Infers when a backend API contract change will break a dependent frontend component.
* **Conflict & Security Flags:** Detects overlapping line modifications and highlights removed authentication checks.
* **Team Stand-Up & Onboarding:** Auto-generates daily progress summaries and instant repository context guides.

---

## 👥 Team GitSync
* **Rakshith:** AI Integration & Prompt Engineering
* **Sneha:** Backend Architecture & GitHub API Pipeline
* **Varshini:** Code Analysis, Dependency Mapping & Security
* **Lahari:** Frontend UI/UX Design & API Linkage
* **Harshini:** Demo Repository Creation & Integration Testing

---
> *Built for HackWave 3.0. Complies with all anti-boring rules: Systems, Agents, Decisions, Real-world relevance.*
