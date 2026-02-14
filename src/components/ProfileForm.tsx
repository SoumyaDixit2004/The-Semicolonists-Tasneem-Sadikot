import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { StudentProfile } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Ireland', 'Netherlands'];
const CAREER_GOALS = ['Software Engineering', 'Data Science', 'AI/ML', 'Research', 'Product Management', 'Cybersecurity', 'Cloud Computing', 'Embedded Systems'];
const INTAKES = ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027'];

interface Props {
  profile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
}

export default function ProfileForm({ profile, onSave }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gpa: profile?.gpa || 0,
    degree: profile?.degree || '',
    branch: profile?.branch || '',
    ielts: profile?.ielts || null as number | null,
    toefl: profile?.toefl || null as number | null,
    gre: profile?.gre || null as number | null,
    preferred_countries: profile?.preferred_countries || [] as string[],
    budget_min: profile?.budget_min || 10000,
    budget_max: profile?.budget_max || 50000,
    career_goal: profile?.career_goal || '',
    work_experience: profile?.work_experience || '',
    research_papers: profile?.research_papers || '',
    intake: profile?.intake || '',
    interested_in_pr: profile?.interested_in_pr || false,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        gpa: profile.gpa, degree: profile.degree, branch: profile.branch,
        ielts: profile.ielts, toefl: profile.toefl, gre: profile.gre,
        preferred_countries: profile.preferred_countries, budget_min: profile.budget_min,
        budget_max: profile.budget_max, career_goal: profile.career_goal,
        work_experience: profile.work_experience || '', research_papers: profile.research_papers || '',
        intake: profile.intake, interested_in_pr: profile.interested_in_pr,
      });
    }
  }, [profile]);

  const toggleCountry = (country: string) => {
    setForm((f) => ({
      ...f,
      preferred_countries: f.preferred_countries.includes(country)
        ? f.preferred_countries.filter((c) => c !== country)
        : [...f.preferred_countries, country],
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileData: StudentProfile = { ...form, user_id: user.id };
      const { error } = profile?.id
        ? await supabase.from('student_profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('user_id', user.id)
        : await supabase.from('student_profiles').insert(profileData);
      if (error) throw error;
      toast({ title: 'Profile saved!' });
      onSave(profileData);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>GPA (out of 4.0)</Label>
          <Input type="number" step="0.01" min="0" max="4" value={form.gpa || ''} onChange={(e) => setForm({ ...form, gpa: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>Degree</Label>
          <Input placeholder="e.g. B.Tech, M.Sc" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
        </div>
        <div>
          <Label>Branch / Major</Label>
          <Input placeholder="e.g. Computer Science" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
        </div>
        <div>
          <Label>Career Goal</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.career_goal} onChange={(e) => setForm({ ...form, career_goal: e.target.value })}>
            <option value="">Select...</option>
            {CAREER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label>IELTS Score (optional)</Label>
          <Input type="number" step="0.5" min="0" max="9" placeholder="e.g. 7.0" value={form.ielts ?? ''} onChange={(e) => setForm({ ...form, ielts: e.target.value ? parseFloat(e.target.value) : null })} />
        </div>
        <div>
          <Label>TOEFL Score (optional)</Label>
          <Input type="number" min="0" max="120" placeholder="e.g. 100" value={form.toefl ?? ''} onChange={(e) => setForm({ ...form, toefl: e.target.value ? parseInt(e.target.value) : null })} />
        </div>
        <div>
          <Label>GRE Score (optional)</Label>
          <Input type="number" min="260" max="340" placeholder="e.g. 320" value={form.gre ?? ''} onChange={(e) => setForm({ ...form, gre: e.target.value ? parseInt(e.target.value) : null })} />
        </div>
      </div>

      <div>
        <Label>Preferred Countries</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCountry(c)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                form.preferred_countries.includes(c) ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted-foreground hover:border-muted-foreground/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Budget Min (USD/year)</Label>
          <Input type="number" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>Budget Max (USD/year)</Label>
          <Input type="number" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Intake</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })}>
            <option value="">Select intake...</option>
            {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-3 pb-1">
          <div className="flex items-center gap-2">
            <Switch checked={form.interested_in_pr} onCheckedChange={(v) => setForm({ ...form, interested_in_pr: v })} />
            <Label>Interested in Permanent Residency</Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Work Experience (optional)</Label>
        <Textarea placeholder="Describe your work experience, if any..." value={form.work_experience} onChange={(e) => setForm({ ...form, work_experience: e.target.value })} rows={3} />
      </div>

      <div>
        <Label>Research Papers (optional)</Label>
        <Textarea placeholder="List any published papers or research work..." value={form.research_papers} onChange={(e) => setForm({ ...form, research_papers: e.target.value })} rows={3} />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Profile
      </Button>
    </div>
  );
}
