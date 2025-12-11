import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar, FileText, Apple, CreditCard } from 'lucide-react';

export default function MemberDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl tracking-wider mb-2">MEMBER DASHBOARD</h1>
          <p className="text-muted-foreground">Track your fitness journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><Calendar className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">3</div>
            <div className="text-muted-foreground text-sm">Enrolled Classes</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><FileText className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">1</div>
            <div className="text-muted-foreground text-sm">Workout Plan</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><Apple className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">1</div>
            <div className="text-muted-foreground text-sm">Diet Plan</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><CreditCard className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1 text-green-500">Active</div>
            <div className="text-muted-foreground text-sm">Subscription</div>
          </div>
        </div>

        <div className="stat-card">
          <h2 className="font-display text-xl tracking-wider mb-4">UPCOMING CLASSES</h2>
          <p className="text-muted-foreground">Browse and enroll in classes from the schedule page.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
