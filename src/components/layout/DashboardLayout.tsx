import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  ClipboardCheck, 
  Bell,
  FileText,
  Apple,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { role, profile, signOut } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    const baseItems = [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: `/${role}` },
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: <Users className="w-5 h-5" />, label: 'Trainers', href: '/admin/trainers' },
          { icon: <Users className="w-5 h-5" />, label: 'Members', href: '/admin/members' },
          { icon: <Calendar className="w-5 h-5" />, label: 'Classes', href: '/classes' },
          { icon: <Apple className="w-5 h-5" />, label: 'Diet Plans', href: '/diet-plans' },
          { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Attendance', href: '/attendance' },
          { icon: <CreditCard className="w-5 h-5" />, label: 'Payments', href: '/admin/payments' },
          { icon: <Bell className="w-5 h-5" />, label: 'Notifications', href: '/admin/notifications' },
        ];
      case 'trainer':
        return [
          ...baseItems,
          { icon: <Calendar className="w-5 h-5" />, label: 'My Classes', href: '/classes' },
          { icon: <FileText className="w-5 h-5" />, label: 'Workout Plans', href: '/trainer/workouts' },
          { icon: <Apple className="w-5 h-5" />, label: 'Diet Plans', href: '/diet-plans' },
          { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Attendance', href: '/attendance' },
          { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/trainer/progress' },
        ];
      case 'member':
        return [
          ...baseItems,
          { icon: <Calendar className="w-5 h-5" />, label: 'Class Schedule', href: '/classes' },
          { icon: <FileText className="w-5 h-5" />, label: 'My Workout Plan', href: '/my-workout-plan' },
          { icon: <Apple className="w-5 h-5" />, label: 'My Diet Plan', href: '/my-diet-plan' },
          { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Attendance', href: '/attendance' },
          { icon: <CreditCard className="w-5 h-5" />, label: 'Subscription', href: '/member/subscription' },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-xl tracking-wider text-foreground">
              POWER<span className="text-primary">FIT</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'sidebar-link',
                location.pathname === item.href && 'active'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link 
            to="/settings" 
            className={cn(
              'sidebar-link',
              location.pathname === '/settings' && 'active'
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button onClick={signOut} className="sidebar-link w-full text-destructive hover:text-destructive">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
