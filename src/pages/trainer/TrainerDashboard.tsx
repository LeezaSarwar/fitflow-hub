import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar, Users, FileText, Apple } from 'lucide-react';

export default function TrainerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl tracking-wider mb-2">TRAINER DASHBOARD</h1>
          <p className="text-muted-foreground">Manage your classes and clients.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><Calendar className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">5</div>
            <div className="text-muted-foreground text-sm">Classes Today</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><Users className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">32</div>
            <div className="text-muted-foreground text-sm">My Clients</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><FileText className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">12</div>
            <div className="text-muted-foreground text-sm">Workout Plans</div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4"><Apple className="w-6 h-6" /></div>
            <div className="font-display text-3xl mb-1">8</div>
            <div className="text-muted-foreground text-sm">Diet Plans</div>
          </div>
        </div>

        <div className="stat-card">
          <h2 className="font-display text-xl tracking-wider mb-4">TODAY'S SCHEDULE</h2>
          <p className="text-muted-foreground">No classes scheduled yet. Create your first class!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
