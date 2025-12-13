import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface GeneratedDietPlan {
  id: string;
  user_id: string;
  goal: string;
  day_of_week: number;
  meal_name: string;
  meal_time: string;
  description: string;
  calories: number | null;
  created_at: string;
}

export interface GeneratedWorkoutPlan {
  id: string;
  user_id: string;
  goal: string;
  day_of_week: number;
  exercise_name: string;
  exercise_time: string;
  sets: number | null;
  reps: number | null;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  date: string;
  item_type: 'diet' | 'workout';
  item_id: string;
  completed: boolean;
}

export function useGeneratedPlans(userId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch diet plans
  const { data: dietPlans = [], isLoading: dietLoading } = useQuery({
    queryKey: ['generated-diet-plans', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('generated_diet_plans')
        .select('*')
        .eq('user_id', userId)
        .order('day_of_week')
        .order('meal_time');
      
      if (error) throw error;
      return data as GeneratedDietPlan[];
    },
    enabled: !!userId,
  });

  // Fetch workout plans
  const { data: workoutPlans = [], isLoading: workoutLoading } = useQuery({
    queryKey: ['generated-workout-plans', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('generated_workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('day_of_week')
        .order('exercise_time');
      
      if (error) throw error;
      return data as GeneratedWorkoutPlan[];
    },
    enabled: !!userId,
  });

  // Fetch today's progress
  const today = new Date().toISOString().split('T')[0];
  
  const { data: todayProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['daily-progress', userId, today],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today);
      
      if (error) throw error;
      return data as DailyProgress[];
    },
    enabled: !!userId,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('daily-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_progress',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['daily-progress', userId, today] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, today, queryClient]);

  // Toggle completion status
  const toggleProgress = useMutation({
    mutationFn: async ({ itemId, itemType, completed }: { itemId: string; itemType: 'diet' | 'workout'; completed: boolean }) => {
      if (!userId) throw new Error('Not authenticated');

      // Check if record exists
      const { data: existing } = await supabase
        .from('daily_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('item_id', itemId)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('daily_progress')
          .update({ completed })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('daily_progress')
          .insert({
            user_id: userId,
            date: today,
            item_type: itemType,
            item_id: itemId,
            completed,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-progress', userId, today] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Calculate stats
  const currentDayOfWeek = new Date().getDay() || 7; // 1-7 (Mon-Sun)
  
  const todayDietItems = dietPlans.filter(p => p.day_of_week === currentDayOfWeek);
  const todayWorkoutItems = workoutPlans.filter(p => p.day_of_week === currentDayOfWeek);
  
  const completedDiet = todayProgress.filter(p => p.item_type === 'diet' && p.completed).length;
  const completedWorkout = todayProgress.filter(p => p.item_type === 'workout' && p.completed).length;

  return {
    dietPlans,
    workoutPlans,
    todayProgress,
    isLoading: dietLoading || workoutLoading || progressLoading,
    toggleProgress: toggleProgress.mutate,
    stats: {
      todayDietItems,
      todayWorkoutItems,
      completedDiet,
      completedWorkout,
      totalDiet: todayDietItems.length,
      totalWorkout: todayWorkoutItems.length,
    },
  };
}
