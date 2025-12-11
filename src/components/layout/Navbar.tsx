import { Dumbbell, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'trainer':
        return '/trainer';
      case 'member':
        return '/member';
      default:
        return '/member';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-2xl tracking-wider text-foreground">
              POWER<span className="text-primary">FIT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/classes" className="nav-link">Classes</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate(getDashboardLink())}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="default" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Home</Link>
              <Link to="/about" className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors">About</Link>
              <Link to="/pricing" className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Pricing</Link>
              <Link to="/classes" className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Classes</Link>
              <div className="border-t border-border/50 my-2" />
              {user ? (
                <>
                  <Button variant="ghost" onClick={() => navigate(getDashboardLink())} className="justify-start">
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleSignOut} className="justify-start">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth')} className="justify-start">
                    Sign In
                  </Button>
                  <Button variant="default" onClick={() => navigate('/auth')} className="justify-start">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
