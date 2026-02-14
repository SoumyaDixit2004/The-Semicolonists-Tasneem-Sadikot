import { StudentProfile, University, Recommendation } from '@/types';

export function generateRecommendations(
  student: StudentProfile,
  universities: University[]
): Recommendation[] {
  return universities
    .map((uni) => {
      let score = 0;

      // GPA match (0-35)
      if (student.gpa >= uni.minGPA) score += 35;
      else if (student.gpa >= uni.minGPA - 0.3) score += 22;
      else if (student.gpa >= uni.minGPA - 0.6) score += 10;

      // Country preference (0-25)
      if (student.preferred_countries.includes(uni.country)) score += 25;

      // Budget (0-25)
      const annualCost = uni.tuitionPerYear + uni.livingCostPerMonth * 12;
      if (annualCost <= student.budget_max) score += 25;
      else if (annualCost <= student.budget_max * 1.2) score += 15;
      else if (annualCost <= student.budget_max * 1.5) score += 5;

      // Test scores (0-15)
      let testScore = 15;
      if (uni.minIELTS && student.ielts && student.ielts < uni.minIELTS) testScore -= 5;
      if (uni.minTOEFL && student.toefl && student.toefl < uni.minTOEFL) testScore -= 5;
      if (uni.minGRE && student.gre && student.gre < uni.minGRE) testScore -= 5;
      score += Math.max(0, testScore);

      // PR bonus
      if (student.interested_in_pr && uni.prFriendly) score += 5;

      // Cap at 100
      score = Math.min(100, score);

      const eligibility: Recommendation['eligibility'] =
        score >= 70 ? 'eligible' : score >= 45 ? 'borderline' : 'not-eligible';

      // ROI calculation
      const totalCost = uni.tuitionPerYear * 2 + uni.livingCostPerMonth * 24;
      const expectedEarnings3yr = uni.avgSalaryAfterGrad * 3;
      const roiScore = Math.round(((expectedEarnings3yr - totalCost) / totalCost) * 100);

      return { university: uni, score, eligibility, roiScore };
    })
    .sort((a, b) => b.score - a.score);
}
