import { Calendar, Clock, User, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AttendanceRecord } from '@/hooks/useAttendance';
import { format, parseISO } from 'date-fns';

interface AttendanceCardProps {
  record: AttendanceRecord;
  role: string | null;
  onUpdateStatus?: (id: string, status: 'present' | 'absent' | 'late') => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  present: {
    icon: CheckCircle,
    label: 'Present',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  absent: {
    icon: XCircle,
    label: 'Absent',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  late: {
    icon: AlertCircle,
    label: 'Late',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
};

export function AttendanceCard({ record, role, onUpdateStatus, onDelete }: AttendanceCardProps) {
  const status = statusConfig[record.status];
  const StatusIcon = status.icon;

  return (
    <div className="stat-card group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display text-lg tracking-wide mb-1">{record.class_title}</h3>
          <Badge className={status.className}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{format(parseISO(record.date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        {role !== 'member' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span>{record.member_name}</span>
          </div>
        )}
        {record.marked_by_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>Marked by {record.marked_by_name}</span>
          </div>
        )}
        {record.qr_token && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>QR Check-in</span>
          </div>
        )}
      </div>

      {(role === 'admin' || role === 'trainer') && (
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            variant={record.status === 'present' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus?.(record.id, 'present')}
            className="flex-1"
          >
            Present
          </Button>
          <Button
            variant={record.status === 'late' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus?.(record.id, 'late')}
            className="flex-1"
          >
            Late
          </Button>
          <Button
            variant={record.status === 'absent' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => onUpdateStatus?.(record.id, 'absent')}
            className="flex-1"
          >
            Absent
          </Button>
        </div>
      )}
    </div>
  );
}
