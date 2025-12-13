import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedPlans } from '@/hooks/useGeneratedPlans';
import { useMemberGoal } from '@/hooks/useMemberGoal';
import { DailyProgressCard } from '@/components/member/DailyProgressCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, UtensilsCrossed, Target } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const goalLabels: Record<string, string> = {
  lose_weight: 'Weight Loss',
  gain_weight: 'Weight Gain',
  build_muscle: 'Muscle Building',
};

export default function GeneratedDietPage() {
  const { user } = useAuth();
  const { dietPlans, todayProgress, isLoading, toggleProgress } = useGeneratedPlans(user?.id);
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

  if (!dietPlans.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <UtensilsCrossed className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl mb-2">No Diet Plan Generated</h2>
          <p className="text-muted-foreground">
            Complete your fitness goal selection to generate a personalized diet plan.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = (itemId: string) => {
    return todayProgress.some(p => p.item_id === itemId && p.completed);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wider mb-2">MY DIET PLAN</h1>
            <p className="text-muted-foreground">Your personalized one-week meal plan</p>
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
            const dayPlans = dietPlans.filter(p => p.day_of_week === index + 1);
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
                  {dayPlans.map(meal => (
                    <DailyProgressCard
                      key={meal.id}
                      id={meal.id}
                      title={meal.meal_name}
                      time={meal.meal_time.slice(0, 5)}
                      description={meal.description}
                      details={meal.calories ? `${meal.calories} calories` : undefined}
                      completed={isCompleted(meal.id)}
                      onToggle={(completed) => toggleProgress({
                        itemId: meal.id,
                        itemType: 'diet',
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
