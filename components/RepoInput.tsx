"use client";

import { useState } from "react";

interface RepoInputProps {
  onSubmit: (data: { repoUrl: string; commitSha: string; role: string }) => void;
}

export default function RepoInput({ onSubmit }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [commitSha, setCommitSha] = useState("");
  const [role, setRole] = useState("Backend");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl || !commitSha) {
      alert("Please fill in all fields");
      return;
    }
    onSubmit({ repoUrl, commitSha, role });
  };

  const loadDemo = () => {
    setRepoUrl("https://github.com/laharibheemanathi/demoproject1");
    setCommitSha("ff46027"); // Replace with your actual demo SHA
    setRole("Backend");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 border border-gray-700"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">What Did I Miss?</h2>
        <button
          type="button"
          onClick={loadDemo}
          className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded transition"
        >
          ⚡ Load Demo
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-400 text-sm font-medium">GitHub Repository URL</label>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-400 text-sm font-medium">Last Known Commit SHA</label>
        <input
          type="text"
          value={commitSha}
          onChange={(e) => setCommitSha(e.target.value)}
          placeholder="abc123def456..."
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-400 text-sm font-medium">Your Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="Backend">Backend Developer</option>
          <option value="Frontend">Frontend Developer</option>
          <option value="Fullstack">Full Stack Developer</option>
          <option value="DevOps">DevOps / Security</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
      >
        🔍 Analyze My Context
      </button>
    </form>
  );
}