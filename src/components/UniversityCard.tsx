import { useState } from 'react';
import { Recommendation } from '@/types';
import { getGeminiExplanation } from '@/lib/gemini';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, TrendingUp, Home, ShoppingCart, Shield, Train, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  rec: Recommendation;
  studentSummary: string;
}

export default function UniversityCard({ rec, studentSummary }: Props) {
  const { university: uni, score, eligibility, roiScore } = rec;
  const [expanded, setExpanded] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const eligibilityConfig = {
    'eligible': { label: 'Eligible', className: 'bg-success text-success-foreground' },
    'borderline': { label: 'Borderline', className: 'bg-warning text-warning-foreground' },
    'not-eligible': { label: 'Not Eligible', className: 'bg-destructive text-destructive-foreground' },
  };

  const fetchAI = async () => {
    setLoadingAI(true);
    const prompt = `You are an overseas education advisor. A student with this profile: ${studentSummary}
is considering ${uni.name} in ${uni.city}, ${uni.country} (Ranked #${uni.ranking}).
Tuition: $${uni.tuitionPerYear}/yr. Match score: ${score}/100 (${eligibility}).
In 3-4 concise bullet points, explain: 1) Why this is/isn't a good fit 2) Key strengths 3) Potential risks 4) One actionable tip.
Keep it practical and honest.`;
    const result = await getGeminiExplanation(prompt);
    setAiInsight(result);
    setLoadingAI(false);
  };

  const annualCost = uni.tuitionPerYear + uni.livingCostPerMonth * 12;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{uni.name}</h3>
            <Badge className={eligibilityConfig[eligibility].className}>
              {eligibilityConfig[eligibility].label}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {uni.city}, {uni.country} · Rank #{uni.ranking}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-brand">{score}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-muted p-2.5 text-center">
          <DollarSign className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
          <div className="font-medium">${(annualCost / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground">Cost/yr</div>
        </div>
        <div className="rounded-lg bg-muted p-2.5 text-center">
          <TrendingUp className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
          <div className="font-medium">${(uni.avgSalaryAfterGrad / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground">Avg Salary</div>
        </div>
        <div className="rounded-lg bg-muted p-2.5 text-center">
          <TrendingUp className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
          <div className={`font-medium ${roiScore > 100 ? 'text-success' : roiScore > 50 ? 'text-warning' : 'text-destructive'}`}>{roiScore}%</div>
          <div className="text-xs text-muted-foreground">ROI (3yr)</div>
        </div>
      </div>

      {uni.prFriendly && (
        <div className="mt-3">
          <Badge variant="outline" className="text-xs border-brand/30 text-brand">PR Friendly</Badge>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
          {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          Campus Life
        </Button>
        <Button variant="outline" size="sm" onClick={fetchAI} disabled={loadingAI || !!aiInsight} className="text-xs">
          {loadingAI ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
          AI Insight
        </Button>
      </div>

      {expanded && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm space-y-1.5">
          <div className="flex items-center gap-2"><Home className="h-3.5 w-3.5 text-muted-foreground" /> <span>{uni.campusLife.housing}</span></div>
          <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> <span>Avg rent: ${uni.campusLife.avgRent}/mo</span></div>
          <div className="flex items-center gap-2"><ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" /> <span>Grocery nearby: {uni.campusLife.groceryNearby ? 'Yes' : 'No'}</span></div>
          <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-muted-foreground" /> <span>Safety: {'⭐'.repeat(uni.campusLife.safetyRating)}</span></div>
          <div className="flex items-center gap-2"><Train className="h-3.5 w-3.5 text-muted-foreground" /> <span>{uni.campusLife.transitAccess}</span></div>
        </div>
      )}

      {aiInsight && (
        <div className="mt-3 rounded-lg border border-brand/20 bg-brand/5 p-3 text-sm text-foreground">
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-brand">
            <Sparkles className="h-3 w-3" /> AI Analysis
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiInsight}</div>
        </div>
      )}
    </div>
  );
}
