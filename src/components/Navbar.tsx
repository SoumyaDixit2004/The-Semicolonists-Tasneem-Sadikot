import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, role, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <GraduationCap className="h-6 w-6" />
          Abrovia
        </div>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline opacity-80">
              {user.email} · <span className="capitalize">{role}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
