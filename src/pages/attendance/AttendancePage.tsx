import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Search, ClipboardCheck, Loader2, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceCard } from '@/components/attendance/AttendanceCard';
import { MarkAttendanceDialog } from '@/components/attendance/MarkAttendanceDialog';
import { Database } from '@/integrations/supabase/types';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];

export default function AttendancePage() {
  const { user, role, loading } = useAuth();
  const { attendance, isLoading, markAttendance, updateAttendance } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const canMarkAttendance = role === 'admin' || role === 'trainer';

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.class_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.member_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Group by date for better organization
  const groupedAttendance = filteredAttendance.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, typeof filteredAttendance>);

  const handleMarkAttendance = (data: {
    class_id: string;
    member_id: string;
    status: AttendanceStatus;
    qr_token?: string;
  }) => {
    markAttendance.mutate(data);
  };

  const handleUpdateStatus = (id: string, status: AttendanceStatus) => {
    updateAttendance.mutate({ id, status });
  };

  // Calculate stats
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    absent: attendance.filter(a => a.status === 'absent').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
              Attendance
            </h1>
            <p className="text-muted-foreground">
              {role === 'member'
                ? 'View your attendance history'
                : 'Track and manage class attendance'}
            </p>
          </div>
          {canMarkAttendance && (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Mark Attendance
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground mb-1">Total Records</p>
            <p className="text-2xl font-display">{stats.total}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground mb-1">Present</p>
            <p className="text-2xl font-display text-green-400">{stats.present}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground mb-1">Late</p>
            <p className="text-2xl font-display text-yellow-400">{stats.late}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-2xl font-display text-red-400">{stats.absent}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by class or member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attendance Records */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : Object.keys(groupedAttendance).length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-display text-xl mb-2">No attendance records</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : role === 'member'
                ? 'Your attendance history will appear here'
                : 'Start marking attendance to see records'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedAttendance)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, records]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-lg">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      ({records.length} {records.length === 1 ? 'record' : 'records'})
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {records.map((record) => (
                      <AttendanceCard
                        key={record.id}
                        record={record}
                        role={role}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mark Attendance Dialog */}
      <MarkAttendanceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleMarkAttendance}
        isSubmitting={markAttendance.isPending}
      />
    </DashboardLayout>
  );
}
