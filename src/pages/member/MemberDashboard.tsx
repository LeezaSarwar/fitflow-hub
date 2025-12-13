import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar, FileText, Apple, CreditCard, Check, X, Dumbbell, UtensilsCrossed, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedPlans } from '@/hooks/useGeneratedPlans';
import { useMemberGoal } from '@/hooks/useMemberGoal';
import { GoalSelectionDialog } from '@/components/onboarding/GoalSelectionDialog';
import { DailyProgressCard } from '@/components/member/DailyProgressCard';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const goalLabels: Record<string, string> = {
  lose_weight: 'Weight Loss',
  gain_weight: 'Weight Gain',
  build_muscle: 'Muscle Building',
};

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: memberGoal, isLoading: goalLoading, refetch: refetchGoal } = useMemberGoal(user?.id);
  const { 
    dietPlans, 
    workoutPlans, 
    todayProgress, 
    stats, 
    toggleProgress, 
    isLoading: plansLoading 
  } = useGeneratedPlans(user?.id);
  
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  // Show goal selection if no goal is set
  useEffect(() => {
    if (!goalLoading && !memberGoal && user?.id) {
      setShowGoalDialog(true);
    }
  }, [memberGoal, goalLoading, user?.id]);

  const handleGoalComplete = () => {
    setShowGoalDialog(false);
    refetchGoal();
  };

  const isCompleted = (itemId: string) => {
    return todayProgress.some(p => p.item_id === itemId && p.completed);
  };

  const dietProgress = stats.totalDiet > 0 ? (stats.completedDiet / stats.totalDiet) * 100 : 0;
  const workoutProgress = stats.totalWorkout > 0 ? (stats.completedWorkout / stats.totalWorkout) * 100 : 0;

  return (
    <DashboardLayout>
      {user?.id && (
        <GoalSelectionDialog
          open={showGoalDialog}
          onComplete={handleGoalComplete}
          userId={user.id}
        />
      )}
      
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wider mb-2">MEMBER DASHBOARD</h1>
            <p className="text-muted-foreground">Track your fitness journey.</p>
          </div>
          {memberGoal && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">{goalLabels[memberGoal.goal]}</span>
            </div>
          )}
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500 w-fit mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl">{stats.completedDiet}</span>
              <span className="text-muted-foreground">/ {stats.totalDiet}</span>
            </div>
            <div className="text-muted-foreground text-sm mb-2">Meals Completed Today</div>
            <Progress value={dietProgress} className="h-2" />
          </div>
          
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl">{stats.completedWorkout}</span>
              <span className="text-muted-foreground">/ {stats.totalWorkout}</span>
            </div>
            <div className="text-muted-foreground text-sm mb-2">Exercises Completed Today</div>
            <Progress value={workoutProgress} className="h-2" />
          </div>
          
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="font-display text-3xl mb-1">{dietPlans.length > 0 ? '7' : '0'}</div>
            <div className="text-muted-foreground text-sm">Day Diet Plan</div>
          </div>
          
          <div className="stat-card">
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="font-display text-3xl mb-1 text-green-500">Active</div>
            <div className="text-muted-foreground text-sm">Subscription</div>
          </div>
        </div>

        {/* Today's Diet */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wider">TODAY'S MEALS</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/my-diet-plan')}>
              View Full Plan
            </Button>
          </div>
          
          {stats.todayDietItems.length > 0 ? (
            <div className="space-y-3">
              {stats.todayDietItems.slice(0, 3).map(meal => (
                <DailyProgressCard
                  key={meal.id}
                  id={meal.id}
                  title={meal.meal_name}
                  time={meal.meal_time.slice(0, 5)}
                  description={meal.description}
                  details={meal.calories ? `${meal.calories} cal` : undefined}
                  completed={isCompleted(meal.id)}
                  onToggle={(completed) => toggleProgress({
                    itemId: meal.id,
                    itemType: 'diet',
                    completed,
                  })}
                />
              ))}
              {stats.todayDietItems.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{stats.todayDietItems.length - 3} more meals
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No diet plan generated yet.</p>
          )}
        </div>

        {/* Today's Workout */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wider">TODAY'S WORKOUT</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/my-workout-plan')}>
              View Full Plan
            </Button>
          </div>
          
          {stats.todayWorkoutItems.length > 0 ? (
            <div className="space-y-3">
              {stats.todayWorkoutItems.slice(0, 3).map(exercise => (
                <DailyProgressCard
                  key={exercise.id}
                  id={exercise.id}
                  title={exercise.exercise_name}
                  time={exercise.exercise_time.slice(0, 5)}
                  description={exercise.description || undefined}
                  details={
                    exercise.sets && exercise.reps
                      ? `${exercise.sets} × ${exercise.reps}`
                      : exercise.duration_minutes
                      ? `${exercise.duration_minutes} min`
                      : undefined
                  }
                  completed={isCompleted(exercise.id)}
                  onToggle={(completed) => toggleProgress({
                    itemId: exercise.id,
                    itemType: 'workout',
                    completed,
                  })}
                />
              ))}
              {stats.todayWorkoutItems.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{stats.todayWorkoutItems.length - 3} more exercises
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No workout plan generated yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
