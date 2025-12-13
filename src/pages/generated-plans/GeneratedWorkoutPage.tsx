import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedPlans } from '@/hooks/useGeneratedPlans';
import { useMemberGoal } from '@/hooks/useMemberGoal';
import { DailyProgressCard } from '@/components/member/DailyProgressCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Dumbbell, Target } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const goalLabels: Record<string, string> = {
  lose_weight: 'Weight Loss',
  gain_weight: 'Weight Gain',
  build_muscle: 'Muscle Building',
};

export default function GeneratedWorkoutPage() {
  const { user } = useAuth();
  const { workoutPlans, todayProgress, isLoading, toggleProgress } = useGeneratedPlans(user?.id);
  const { data: memberGoal } = useMemberGoal(user?.id);

  const currentDayOfWeek = new Date().getDay() || 7;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!workoutPlans.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <Dumbbell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl mb-2">No Workout Plan Generated</h2>
          <p className="text-muted-foreground">
            Complete your fitness goal selection to generate a personalized workout plan.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = (itemId: string) => {
    return todayProgress.some(p => p.item_id === itemId && p.completed);
  };

  const getExerciseDetails = (exercise: typeof workoutPlans[0]) => {
    const parts = [];
    if (exercise.sets && exercise.reps) {
      parts.push(`${exercise.sets} sets × ${exercise.reps} reps`);
    }
    if (exercise.duration_minutes) {
      parts.push(`${exercise.duration_minutes} minutes`);
    }
    return parts.join(' • ') || undefined;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wider mb-2">MY WORKOUT PLAN</h1>
            <p className="text-muted-foreground">Your personalized one-week exercise routine</p>
          </div>
          {memberGoal && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">{goalLabels[memberGoal.goal]}</span>
            </div>
          )}
        </div>

        <Tabs defaultValue={currentDayOfWeek.toString()} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {DAYS.map((day, index) => (
              <TabsTrigger
                key={day}
                value={(index + 1).toString()}
                className={index + 1 === currentDayOfWeek ? 'ring-2 ring-primary' : ''}
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map((day, index) => {
            const dayPlans = workoutPlans.filter(p => p.day_of_week === index + 1);
            const isToday = index + 1 === currentDayOfWeek;

            return (
              <TabsContent key={day} value={(index + 1).toString()} className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-display text-xl">{day.toUpperCase()}</h2>
                  {isToday && (
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">Today</span>
                  )}
                </div>
                <div className="space-y-3">
                  {dayPlans.map(exercise => (
                    <DailyProgressCard
                      key={exercise.id}
                      id={exercise.id}
                      title={exercise.exercise_name}
                      time={exercise.exercise_time.slice(0, 5)}
                      description={exercise.description || undefined}
                      details={getExerciseDetails(exercise)}
                      completed={isCompleted(exercise.id)}
                      onToggle={(completed) => toggleProgress({
                        itemId: exercise.id,
                        itemType: 'workout',
                        completed,
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
