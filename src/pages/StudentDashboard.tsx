import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { StudentProfile, CounselorNote } from '@/types';
import Navbar from '@/components/Navbar';
import ProfileForm from '@/components/ProfileForm';
import RecommendationsList from '@/components/RecommendationsList';
import AIAnalysis from '@/components/AIAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, GraduationCap, MessageSquare, Loader2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [notes, setNotes] = useState<CounselorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfile(data as StudentProfile);
        setActiveTab('recommendations');
      }
      const { data: notesData } = await supabase.from('counselor_notes').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
      if (notesData) setNotes(notesData as CounselorNote[]);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleProfileSave = (p: StudentProfile) => {
    setProfile(p);
    setActiveTab('recommendations');
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Student Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-4 w-4" /> My Profile</TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-1.5" disabled={!profile}><GraduationCap className="h-4 w-4" /> Recommendations</TabsTrigger>
            <TabsTrigger value="feedback" className="gap-1.5"><MessageSquare className="h-4 w-4" /> Counselor Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm profile={profile} onSave={handleProfileSave} />
          </TabsContent>
          <TabsContent value="recommendations">
            {profile ? <RecommendationsList profile={profile} /> : <p className="text-muted-foreground">Please complete your profile first.</p>}
          </TabsContent>
          <TabsContent value="feedback">
            {notes.length === 0 ? (
              <p className="text-muted-foreground">No counselor feedback yet.</p>
            ) : (
              <div className="space-y-3 max-w-2xl">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{n.university_name || 'General'}</span>
                      <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{n.note}</p>
                    <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      n.status === 'approved' ? 'bg-success/10 text-success' : n.status === 'needs-changes' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>{n.status}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
