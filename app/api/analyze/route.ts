// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { analyzeCodebase } from '@/lib/analyser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const commits = body.commits || [];
    
    // Call the analysis engine
    const analysis = analyzeCodebase(commits);
    
    return NextResponse.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Analysis failed' 
    }, { status: 500 });
  }
}