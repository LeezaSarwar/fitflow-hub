import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FitnessClass } from '@/hooks/useClasses';
import { format, parseISO } from 'date-fns';

interface ClassCardProps {
  fitnessClass: FitnessClass;
  role: string | null;
  onEnroll?: (classId: string) => void;
  onUnenroll?: (classId: string) => void;
  onEdit?: (fitnessClass: FitnessClass) => void;
  onDelete?: (classId: string) => void;
  isEnrolling?: boolean;
}

export function ClassCard({
  fitnessClass,
  role,
  onEnroll,
  onUnenroll,
  onEdit,
  onDelete,
  isEnrolling,
}: ClassCardProps) {
  const isFull = fitnessClass.max_capacity !== null && 
                 fitnessClass.enrolled_count !== undefined && 
                 fitnessClass.enrolled_count >= fitnessClass.max_capacity;

  const isPastClass = new Date(fitnessClass.schedule_date) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="stat-card group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl tracking-wide mb-1">{fitnessClass.title}</h3>
          {fitnessClass.class_type && (
            <Badge variant="secondary" className="text-xs">
              {fitnessClass.class_type}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {isPastClass && (
            <Badge variant="outline" className="text-muted-foreground border-muted">
              Past
            </Badge>
          )}
          {fitnessClass.is_enrolled && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Enrolled
            </Badge>
          )}
          {isFull && !fitnessClass.is_enrolled && (
            <Badge variant="destructive">Full</Badge>
          )}
        </div>
      </div>

      {fitnessClass.description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {fitnessClass.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{format(parseISO(fitnessClass.schedule_date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{fitnessClass.start_time.slice(0, 5)} - {fitnessClass.end_time.slice(0, 5)}</span>
        </div>
        {fitnessClass.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{fitnessClass.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 text-primary" />
          <span>{fitnessClass.trainer_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>
            {fitnessClass.enrolled_count || 0}
            {fitnessClass.max_capacity && ` / ${fitnessClass.max_capacity}`} enrolled
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        {role === 'member' && !isPastClass && (
          fitnessClass.is_enrolled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnenroll?.(fitnessClass.id)}
              disabled={isEnrolling}
              className="flex-1"
            >
              Unenroll
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onEnroll?.(fitnessClass.id)}
              disabled={isFull || isEnrolling}
              className="flex-1"
            >
              {isFull ? 'Class Full' : 'Enroll Now'}
            </Button>
          )
        )}

        {(role === 'admin' || role === 'trainer') && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(fitnessClass)}
              className="flex-1"
            >
              Edit
            </Button>
            {role === 'admin' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(fitnessClass.id)}
                className="flex-1"
              >
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
