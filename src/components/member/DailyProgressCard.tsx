import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyProgressCardProps {
  id: string;
  title: string;
  time: string;
  description?: string;
  details?: string;
  completed: boolean;
  onToggle: (completed: boolean) => void;
}

export function DailyProgressCard({
  title,
  time,
  description,
  details,
  completed,
  onToggle,
}: DailyProgressCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all",
      completed ? "bg-green-500/10 border-green-500/30" : "bg-card border-border"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-mono">{time}</span>
            <h4 className={cn(
              "font-medium truncate",
              completed && "line-through text-muted-foreground"
            )}>
              {title}
            </h4>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
          {details && (
            <p className="text-xs text-muted-foreground mt-1">{details}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onToggle(true)}
            className={cn(
              "p-2 rounded-lg border transition-all",
              completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-green-500/30 text-green-500 hover:bg-green-500/10"
            )}
            aria-label="Mark as complete"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle(false)}
            className={cn(
              "p-2 rounded-lg border transition-all",
              !completed
                ? "bg-red-500 border-red-500 text-white"
                : "border-red-500/30 text-red-500 hover:bg-red-500/10"
            )}
            aria-label="Mark as incomplete"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
