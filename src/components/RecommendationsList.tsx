import { useMemo } from 'react';
import { StudentProfile, Recommendation } from '@/types';
import { universities } from '@/data/universities';
import { generateRecommendations } from '@/lib/recommendationEngine';
import UniversityCard from './UniversityCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  profile: StudentProfile;
}

const CHART_COLORS = ['hsl(175, 55%, 42%)', 'hsl(215, 50%, 18%)', 'hsl(38, 92%, 50%)', 'hsl(145, 60%, 40%)', 'hsl(0, 84%, 60%)', 'hsl(270, 50%, 50%)', 'hsl(30, 80%, 55%)'];

export default function RecommendationsList({ profile }: Props) {
  const recommendations = useMemo(() => generateRecommendations(profile, universities), [profile]);

  const studentSummary = `GPA: ${profile.gpa}, Degree: ${profile.degree} (${profile.branch}), Career: ${profile.career_goal}, Budget: $${profile.budget_min}-$${profile.budget_max}/yr, IELTS: ${profile.ielts || 'N/A'}, TOEFL: ${profile.toefl || 'N/A'}, GRE: ${profile.gre || 'N/A'}, PR interest: ${profile.interested_in_pr ? 'Yes' : 'No'}`;

  const top5 = recommendations.slice(0, 5);
  const roiData = top5.map((r) => ({
    name: r.university.name.length > 15 ? r.university.name.slice(0, 15) + '…' : r.university.name,
    'Total Cost (2yr)': r.university.tuitionPerYear * 2 + r.university.livingCostPerMonth * 24,
    'Expected Salary': r.university.avgSalaryAfterGrad,
  }));

  const costBreakdown = top5.length > 0
    ? [
        { name: 'Tuition', value: top5[0].university.tuitionPerYear * 2 },
        { name: 'Living', value: top5[0].university.livingCostPerMonth * 24 },
      ]
    : [];

  const eligible = recommendations.filter((r) => r.eligibility === 'eligible').length;
  const borderline = recommendations.filter((r) => r.eligibility === 'borderline').length;
  const notEligible = recommendations.filter((r) => r.eligibility === 'not-eligible').length;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
          <div className="text-2xl font-bold text-success">{eligible}</div>
          <div className="text-sm text-muted-foreground">Eligible</div>
        </div>
        <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 text-center">
          <div className="text-2xl font-bold text-warning">{borderline}</div>
          <div className="text-sm text-muted-foreground">Borderline</div>
        </div>
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{notEligible}</div>
          <div className="text-sm text-muted-foreground">Not Eligible</div>
        </div>
      </div>

      {/* ROI Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Cost vs Salary (Top 5)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roiData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="Total Cost (2yr)" fill="hsl(215, 50%, 18%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expected Salary" fill="hsl(175, 55%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {costBreakdown.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Cost Breakdown – {top5[0].university.name}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={costBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {costBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* University Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">All Recommendations</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recommendations.map((rec) => (
            <UniversityCard key={rec.university.id} rec={rec} studentSummary={studentSummary} />
          ))}
        </div>
      </div>
    </div>
  );
}
