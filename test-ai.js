async function testFeatherlessAI() {
  console.log('🧪 Testing Featherless AI Integration...\n');

  const mockData = {
    userName: "Rakshith",
    userRole: "Backend",
    githubData: {
      commits: [
        {
          author: "Harshini",
          message: "Refactor authentication middleware",
          files: ["backend/auth.py", "backend/middleware.py"],
          timestamp: "2026-09-04T11:15:00Z"
        },
        {
          author: "Sneha",
          message: "Update dashboard UI",
          files: ["frontend/dashboard.jsx"],
          timestamp: "2026-09-04T12:00:00Z"
        }
      ],
      diffs_summary: "auth.py: Removed hardcoded API key check. dashboard.jsx: Updated to use new API format."
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! AI Response:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error('❌ ERROR:', result);
    }
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

testFeatherlessAI();