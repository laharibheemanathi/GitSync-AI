// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const dataRes = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, username, lastSHA: '' })
      });
      const dataJson = await dataRes.json();
      if (!dataJson.success) throw new Error(dataJson.error);

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubData: dataJson.data, userRole: 'developer', userName: username })
      });
      const analyzeJson = await analyzeRes.json();
      if (!analyzeJson.success) throw new Error(analyzeJson.error);

      setResult(analyzeJson.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFile = (index: number) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFiles(newExpanded);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', color: 'white', marginBottom: '10px' }}>
          GitSync AI
        </h1>
        <p style={{ textAlign: 'center', color: 'white', marginBottom: '40px', fontSize: '18px' }}>
          "What Did I Miss?" - AI-powered GitHub repository analyzer
        </p>

        {/* Input Form */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
          <form onSubmit={handleAnalyze}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>GitHub Repository URL</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>GitHub Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Repository'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: '#fee', border: '2px solid #f87171', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#991b1b' }}>
            Error: {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Project Overview */}
            <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', padding: '25px', borderRadius: '10px', color: 'white', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>📊 Project Overview</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{result.overallProjectSummary}</p>
              
              {result.criticalDependencies && result.criticalDependencies.length > 0 && (
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>🔗 Critical Dependencies</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {result.criticalDependencies.map((dep: string, i: number) => (
                      <li key={i} style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '5px', fontFamily: 'monospace' }}>
                        → {dep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* File Analysis */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>📁 File Analysis ({result.files?.length || 0} files)</h2>
              
              {result.files?.map((fileData: any, index: number) => {
                const isExpanded = expandedFiles.has(index);
                
                return (
                  <div key={index} style={{ border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
                    {/* Clickable Header */}
                    <div
                      onClick={() => toggleFile(index)}
                      style={{
                        background: isExpanded ? '#f3f4f6' : '#f9fafb',
                        padding: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: fileData.status === 'added' ? '#d1fae5' : fileData.status === 'modified' ? '#dbeafe' : '#fee2e2',
                          color: fileData.status === 'added' ? '#065f46' : fileData.status === 'modified' ? '#1e40af' : '#991b1b'
                        }}>
                          {fileData.status?.toUpperCase() || 'MODIFIED'}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                          {fileData.fileName}
                        </span>
                        {fileData.riskLevel && (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white',
                            background: fileData.riskLevel === 'high' ? '#ef4444' : fileData.riskLevel === 'medium' ? '#f59e0b' : '#10b981'
                          }}>
                            {fileData.riskLevel.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#6b7280' }}>+{fileData.additions || 0} -{fileData.deletions || 0}</span>
                        <span style={{ fontSize: '20px' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div style={{ padding: '20px', background: 'white' }}>
                        {/* Summary */}
                        <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '15px', marginBottom: '15px' }}>
                          <h4 style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>📝 Summary</h4>
                          <p style={{ color: '#1e40af', lineHeight: '1.6' }}>{fileData.summary}</p>
                        </div>

                        {/* Changes */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <div style={{ background: '#faf5ff', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#6b21a8', marginBottom: '10px' }}>🎯 Prioritized Changes</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {fileData.prioritizedChanges?.map((change: string, i: number) => (
                                <li key={i} style={{ color: '#6b21a8', marginBottom: '5px' }}>{change}</li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>📋 All Changes</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {fileData.allChanges?.map((change: string, i: number) => (
                                <li key={i} style={{ color: '#374151', marginBottom: '5px' }}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {/* Code Snippet Causing Impact - ONLY show if file actually impacts others */}
                        {(fileData.impactedFiles && fileData.impactedFiles.length > 0) && (
                          <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontFamily: 'monospace', fontSize: '14px' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '10px', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              💻 Code Causing Impact
                            </h4>
                            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #38bdf8', overflowX: 'auto' }}>
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.5' }}>
                                {fileData.impactSnippet}
                              </pre>
                            </div>
                            {fileData.impactReason && (
                              <p style={{ marginTop: '10px', color: '#94a3b8', fontFamily: 'sans-serif', fontSize: '13px', fontStyle: 'italic' }}>
                                💡 Reason: {fileData.impactReason}
                              </p>
                            )}
                          </div>
                        )}
                        {/* Impacted Files */}
                        {fileData.impactedFiles && fileData.impactedFiles.length > 0 && (
                          <div style={{ background: '#fff7ed', border: '2px solid #fed7aa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#9a3412', marginBottom: '10px' }}> Impacts These Files</h4>
                            {fileData.impactedFiles.map((f: string, i: number) => (
                              <div key={i} style={{ background: '#fed7aa', color: '#9a3412', padding: '6px 12px', borderRadius: '6px', fontFamily: 'monospace', marginBottom: '5px', display: 'inline-block', marginRight: '5px' }}>
                                {f}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Security */}
                        {fileData.securityConcerns && fileData.securityConcerns !== 'None' && (
                          <div style={{ background: '#fef2f2', border: '2px solid #fecaca', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: '8px' }}>⚠️ Security Alert</h4>
                            <p style={{ color: '#991b1b' }}>{fileData.securityConcerns}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}