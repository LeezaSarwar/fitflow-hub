import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, Dumbbell, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoalSelectionDialogProps {
  open: boolean;
  onComplete: () => void;
  userId: string;
}

type FitnessGoal = 'lose_weight' | 'gain_weight' | 'build_muscle';

const goals = [
  {
    id: 'lose_weight' as FitnessGoal,
    title: 'Lose Weight',
    description: 'Burn fat and get leaner with cardio-focused training',
    icon: TrendingDown,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
  },
  {
    id: 'gain_weight' as FitnessGoal,
    title: 'Gain Weight',
    description: 'Build mass with strength training and nutrition',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30 hover:border-green-500',
  },
  {
    id: 'build_muscle' as FitnessGoal,
    title: 'Build Muscle',
    description: 'Sculpt your body with progressive overload training',
    icon: Dumbbell,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30 hover:border-primary',
  },
];

export function GoalSelectionDialog({ open, onComplete, userId }: GoalSelectionDialogProps) {
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedGoal) return;

    setIsGenerating(true);
    try {
      // Save the goal
      const { error: goalError } = await supabase.from('member_goals').insert({
        user_id: userId,
        goal: selectedGoal,
      });

      if (goalError) throw goalError;

      // Generate personalized plans via edge function
      const { data, error } = await supabase.functions.invoke('generate-plans', {
        body: { goal: selectedGoal, userId },
      });

      if (error) throw error;

      toast({
        title: 'Plans Generated!',
        description: 'Your personalized diet and workout plans are ready.',
      });

      onComplete();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate plans. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider">
            WHAT'S YOUR FITNESS GOAL?
          </DialogTitle>
          <DialogDescription>
            Select your primary goal and we'll create a personalized one-week diet and workout plan just for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                disabled={isGenerating}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                  isSelected 
                    ? `${goal.borderColor.split(' ')[1]} ${goal.bgColor}` 
                    : `border-border hover:${goal.borderColor.split(' ')[1]}`
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`p-3 rounded-lg ${goal.bgColor}`}>
                  <Icon className={`w-6 h-6 ${goal.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedGoal || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Your Plans...
            </>
          ) : (
            'Generate My Plans'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
