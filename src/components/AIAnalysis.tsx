import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AIAnalysisProps {
  profile: any; // your StudentProfile
}

export default function AIAnalysis({ profile }: AIAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const prompt = `Analyze this student profile and give a detailed AI recommendation:\n${JSON.stringify(profile, null, 2)}`;
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.explanation) {
        setAnalysis(data.explanation);
      } else {
        setError('No AI response received.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Split bullets for rendering
  const renderAnalysis = () => {
    if (!analysis) return null;
    const points = analysis.split('\n').filter(line => line.startsWith('*')).map(line => line.replace(/^\*\s*/, ''));
    return (
      <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
        {points.map((p, i) => {
          const [title, ...rest] = p.split(':');
          return (
            <p key={i} className="text-sm text-foreground">
              <strong>{title}:</strong> {rest.join(':').trim()}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={fetchAnalysis}
        disabled={loading}
        className="px-4 py-2 rounded bg-brand text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'AI Analysis'}
      </button>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {analysis && renderAnalysis()}
    </div>
  );
}
