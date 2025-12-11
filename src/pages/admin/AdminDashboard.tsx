import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Calendar, CreditCard, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const stats = [
  { label: 'Total Members', value: '248', change: '+12%', icon: <Users className="w-6 h-6" />, up: true },
  { label: 'Active Trainers', value: '15', change: '+2', icon: <Users className="w-6 h-6" />, up: true },
  { label: 'Classes Today', value: '8', change: '0', icon: <Calendar className="w-6 h-6" />, up: true },
  { label: 'Revenue (Month)', value: '$12,450', change: '+8%', icon: <CreditCard className="w-6 h-6" />, up: true },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl tracking-wider mb-2">ADMIN DASHBOARD</h1>
          <p className="text-muted-foreground">Welcome back! Here's your gym overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">{stat.icon}</div>
                <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="font-display text-3xl mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <h2 className="font-display text-xl tracking-wider mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm">Add Trainer</span>
            </button>
            <button className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm">Create Class</span>
            </button>
            <button className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center">
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm">View Payments</span>
            </button>
            <button className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
