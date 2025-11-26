import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Calculator as CalcIcon, 
  Bell,
  Menu,
  X,
  Users
} from 'lucide-react';
import { ROLE_LABELS } from '@/types/group';
import Calculator from './Calculator';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';

const MainLayout: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-tight">
                Eldoret Technicians
              </h1>
              <p className="text-xs text-muted-foreground">
                Self Help Group
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setShowCalculator(true)}
            >
              <CalcIcon className="w-4 h-4 mr-2" />
              Calculator
            </Button>
            
            <Button variant="glass" size="icon">
              <Bell className="w-4 h-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="text-right mr-2">
              <p className="text-sm font-medium text-foreground">
                {currentUser?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {ROLE_LABELS[currentUser?.role || 'member']}
              </p>
            </div>

            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setShowCalculator(true)}
            >
              <CalcIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-border bg-card p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {ROLE_LABELS[currentUser?.role || 'member']}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {isAdmin ? <AdminDashboard /> : <MemberDashboard />}
      </main>

      {/* Calculator Modal */}
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default MainLayout;
