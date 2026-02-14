// frontend/lib/gemini.ts
export async function getGeminiExplanation(prompt: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:5000/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);

    const data = await response.json();
    return data.explanation || 'No explanation available.';
  } catch (error) {
    console.error('Gemini fetch error:', error);
    return 'AI explanation is currently unavailable. Recommendations are still based on your profile data.';
  }
}
