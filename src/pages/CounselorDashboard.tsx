import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { StudentProfile, CounselorNote } from '@/types';
import { universities } from '@/data/universities';
import { generateRecommendations } from '@/lib/recommendationEngine';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, ChevronDown, ChevronUp, Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CounselorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<(StudentProfile & { email?: string; full_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, CounselorNote[]>>({});
  const [newNote, setNewNote] = useState('');
  const [newNoteUni, setNewNoteUni] = useState('');
  const [noteStatus, setNoteStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase.from('student_profiles').select('*');
      if (profiles) {
        // Fetch profile info for each student
        const enriched = await Promise.all(
          (profiles as StudentProfile[]).map(async (p) => {
            const { data: prof } = await supabase.from('profiles').select('full_name, email').eq('id', p.user_id).single();
            return { ...p, full_name: prof?.full_name, email: prof?.email };
          })
        );
        setStudents(enriched);

        // Fetch all counselor notes
        if (user) {
          const { data: allNotes } = await supabase.from('counselor_notes').select('*').eq('counselor_id', user.id);
          if (allNotes) {
            const grouped: Record<string, CounselorNote[]> = {};
            (allNotes as CounselorNote[]).forEach((n) => {
              if (!grouped[n.student_id]) grouped[n.student_id] = [];
              grouped[n.student_id].push(n);
            });
            setNotes(grouped);
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const addNote = async (studentId: string) => {
    if (!user || !newNote.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('counselor_notes').insert({
      counselor_id: user.id,
      student_id: studentId,
      university_name: newNoteUni,
      note: newNote,
      status: noteStatus,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Note added!' });
      setNewNote('');
      setNewNoteUni('');
      // Refresh notes
      const { data } = await supabase.from('counselor_notes').select('*').eq('counselor_id', user.id).eq('student_id', studentId);
      if (data) setNotes((prev) => ({ ...prev, [studentId]: data as CounselorNote[] }));
    }
    setSubmitting(false);
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
        <div className="mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold text-foreground">Counselor Dashboard</h1>
          <Badge variant="outline" className="ml-2">{students.length} students</Badge>
        </div>

        {students.length === 0 ? (
          <p className="text-muted-foreground">No student profiles found.</p>
        ) : (
          <div className="space-y-3">
            {students.map((s) => {
              const isExpanded = expandedId === s.user_id;
              const recs = generateRecommendations(s, universities).slice(0, 5);
              const studentNotes = notes[s.user_id] || [];

              return (
                <div key={s.user_id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : s.user_id)}
                  >
                    <div>
                      <div className="font-medium text-foreground">{s.full_name || s.email || 'Student'}</div>
                      <div className="text-sm text-muted-foreground">
                        {s.degree} · {s.branch} · GPA {s.gpa} · {s.career_goal}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                      {/* Profile details */}
                      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                        <div><span className="text-muted-foreground">Budget:</span> ${s.budget_min?.toLocaleString()}-${s.budget_max?.toLocaleString()}</div>
                        <div><span className="text-muted-foreground">IELTS:</span> {s.ielts || 'N/A'}</div>
                        <div><span className="text-muted-foreground">TOEFL:</span> {s.toefl || 'N/A'}</div>
                        <div><span className="text-muted-foreground">GRE:</span> {s.gre || 'N/A'}</div>
                        <div><span className="text-muted-foreground">Countries:</span> {s.preferred_countries?.join(', ')}</div>
                        <div><span className="text-muted-foreground">Intake:</span> {s.intake}</div>
                        <div><span className="text-muted-foreground">PR:</span> {s.interested_in_pr ? 'Yes' : 'No'}</div>
                      </div>

                      {s.work_experience && (
                        <div className="text-sm"><span className="text-muted-foreground">Work Experience:</span> {s.work_experience}</div>
                      )}
                      {s.research_papers && (
                        <div className="text-sm"><span className="text-muted-foreground">Research:</span> {s.research_papers}</div>
                      )}

                      {/* Top recommendations */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Top AI Recommendations</h4>
                        <div className="space-y-1.5">
                          {recs.map((r) => (
                            <div key={r.university.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                              <span className="text-foreground">{r.university.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-brand">{r.score}/100</span>
                                <Badge className={`text-xs ${
                                  r.eligibility === 'eligible' ? 'bg-success text-success-foreground' :
                                  r.eligibility === 'borderline' ? 'bg-warning text-warning-foreground' :
                                  'bg-destructive text-destructive-foreground'
                                }`}>{r.eligibility}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Existing notes */}
                      {studentNotes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Your Notes</h4>
                          <div className="space-y-2">
                            {studentNotes.map((n) => (
                              <div key={n.id} className="rounded-lg border border-border p-3 text-sm">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{n.university_name || 'General'}</span>
                                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                                    n.status === 'approved' ? 'bg-success/10 text-success' :
                                    n.status === 'needs-changes' ? 'bg-warning/10 text-warning' :
                                    'bg-muted text-muted-foreground'
                                  }`}>{n.status}</span>
                                </div>
                                <p className="text-muted-foreground">{n.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add note */}
                      <div className="rounded-lg border border-border p-3 space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">Add Feedback</h4>
                        <Input placeholder="University name (optional)" value={newNoteUni} onChange={(e) => setNewNoteUni(e.target.value)} />
                        <Textarea placeholder="Your feedback or notes..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2} />
                        <div className="flex items-center gap-2">
                          <select className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" value={noteStatus} onChange={(e) => setNoteStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="needs-changes">Needs Changes</option>
                          </select>
                          <Button size="sm" onClick={() => addNote(s.user_id)} disabled={submitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
                            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-1" />} Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
