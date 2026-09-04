import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt } from '@/lib/prompts';

// Initialize Featherless AI (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: process.env.FEATHERLESS_API_KEY,
  baseURL: process.env.FEATHERLESS_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { githubData, userRole, userName } = body;

    // Validate inputs
    if (!githubData || !userRole || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: githubData, userRole, userName' },
        { status: 400 }
      );
    }

    console.log(`🤖 Analyzing for ${userName} (${userRole})...`);

    // Call Featherless AI
    const completion = await openai.chat.completions.create({
      model: process.env.FEATHERLESS_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `User: ${userName}, Role: ${userRole}. GitHub Data: ${JSON.stringify(githubData)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse and validate JSON
    try {
      const parsedResponse = JSON.parse(aiResponse || '{}');
      
      // Ensure all required keys exist
      const requiredKeys = [
        'project_summary',
        'major_changes',
        'relevant_changes',
        'dependency_impact',
        'conflict_risk',
        'security_impact',
        'recommended_actions'
      ];

      for (const key of requiredKeys) {
        if (!(key in parsedResponse)) {
          parsedResponse[key] = key.includes('impact') || key.includes('risk') 
            ? 'None detected' 
            : [];
        }
      }

      console.log('✅ Featherless AI analysis complete');
      return NextResponse.json(parsedResponse);

    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Raw AI response:', aiResponse);
      return NextResponse.json(
        { error: 'AI returned invalid JSON format' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Server error in /api/analyze:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}