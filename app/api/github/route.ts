// app/api/github/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '../../../lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl, username, lastSHA } = body;

    // Validate inputs
    if (!repoUrl || !username) {
      return NextResponse.json(
        { error: 'Repository URL and username are required' },
        { status: 400 }
      );
    }

    // Fetch GitHub data
    const githubData = await fetchGitHubData(repoUrl, username, lastSHA || '');

    return NextResponse.json({
      success: true,
      data: githubData,
    });
  } catch (error) {
    console.error('Error in GitHub API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}