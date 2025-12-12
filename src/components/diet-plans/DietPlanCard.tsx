import { Calendar, User, Users, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DietPlan } from '@/hooks/useDietPlans';
import { format, parseISO } from 'date-fns';

interface DietPlanCardProps {
  plan: DietPlan;
  role: string | null;
  onEdit?: (plan: DietPlan) => void;
  onDelete?: (planId: string) => void;
}

export function DietPlanCard({ plan, role, onEdit, onDelete }: DietPlanCardProps) {
  const handleDownload = () => {
    if (plan.file_url) {
      window.open(plan.file_url, '_blank');
    }
  };

  return (
    <div className="stat-card group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display text-xl tracking-wide mb-2">{plan.title}</h3>
          <div className="flex flex-wrap gap-2">
            {plan.member_name && (
              <Badge variant="secondary" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                {plan.member_name}
              </Badge>
            )}
            {plan.class_title && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {plan.class_title}
              </Badge>
            )}
          </div>
        </div>
        {plan.file_url && (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <FileText className="w-3 h-3 mr-1" />
            File
          </Badge>
        )}
      </div>

      {plan.description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {plan.description}
        </p>
      )}

      {plan.notes && (
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-sm text-muted-foreground italic line-clamp-2">
            "{plan.notes}"
          </p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 text-primary" />
          <span>By {plan.trainer_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{format(parseISO(plan.created_at), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        {plan.file_url && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}

        {(role === 'admin' || role === 'trainer') && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(plan)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(plan.id)}
              className="flex-1"
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
