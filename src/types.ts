export interface StudentProfile {
  id?: string;
  user_id: string;
  gpa: number;
  degree: string;
  branch: string;
  ielts?: number | null;
  toefl?: number | null;
  gre?: number | null;
  preferred_countries: string[];
  budget_min: number;
  budget_max: number;
  career_goal: string;
  work_experience?: string;
  research_papers?: string;
  intake: string;
  interested_in_pr: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  tuitionPerYear: number;
  livingCostPerMonth: number;
  avgSalaryAfterGrad: number;
  minGPA: number;
  minIELTS?: number;
  minTOEFL?: number;
  minGRE?: number;
  programs: string[];
  prFriendly: boolean;
  campusLife: {
    housing: string;
    groceryNearby: boolean;
    avgRent: number;
    safetyRating: number;
    transitAccess: string;
  };
}

export interface Recommendation {
  university: University;
  score: number;
  eligibility: 'eligible' | 'borderline' | 'not-eligible';
  roiScore: number;
}

export interface CounselorNote {
  id: string;
  counselor_id: string;
  student_id: string;
  university_name: string;
  note: string;
  status: string;
  created_at: string;
}
