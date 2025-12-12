import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DietPlan {
  id: string;
  title: string;
  description: string | null;
  trainer_id: string;
  member_id: string | null;
  class_id: string | null;
  file_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  trainer_name?: string;
  member_name?: string;
  class_title?: string;
}

export function useDietPlans() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const dietPlansQuery = useQuery({
    queryKey: ['diet-plans'],
    queryFn: async () => {
      let query = supabase.from('diet_plans').select('*');

      // Members only see their own plans
      if (role === 'member') {
        query = query.eq('member_id', user!.id);
      }
      // Trainers see plans they created
      else if (role === 'trainer') {
        query = query.eq('trainer_id', user!.id);
      }

      const { data: plans, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Get trainer profiles
      const trainerIds = [...new Set(plans.map(p => p.trainer_id))];
      const { data: trainers } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', trainerIds);

      // Get member profiles
      const memberIds = [...new Set(plans.filter(p => p.member_id).map(p => p.member_id!))];
      const { data: members } = memberIds.length > 0
        ? await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', memberIds)
        : { data: [] };

      // Get class titles
      const classIds = [...new Set(plans.filter(p => p.class_id).map(p => p.class_id!))];
      const { data: classes } = classIds.length > 0
        ? await supabase
            .from('fitness_classes')
            .select('id, title')
            .in('id', classIds)
        : { data: [] };

      return plans.map(p => ({
        ...p,
        trainer_name: trainers?.find(t => t.user_id === p.trainer_id)?.full_name || 'Unknown',
        member_name: p.member_id ? members?.find(m => m.user_id === p.member_id)?.full_name : null,
        class_title: p.class_id ? classes?.find(c => c.id === p.class_id)?.title : null,
      })) as DietPlan[];
    },
    enabled: !!user,
  });

  const createDietPlan = useMutation({
    mutationFn: async (planData: {
      title: string;
      description?: string;
      member_id?: string;
      class_id?: string;
      file_url?: string;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('diet_plans')
        .insert({
          ...planData,
          trainer_id: user!.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      toast.success('Diet plan created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create diet plan: ' + error.message);
    },
  });

  const updateDietPlan = useMutation({
    mutationFn: async ({ id, ...planData }: Partial<DietPlan> & { id: string }) => {
      const { error } = await supabase
        .from('diet_plans')
        .update(planData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      toast.success('Diet plan updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update diet plan: ' + error.message);
    },
  });

  const deleteDietPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('diet_plans')
        .delete()
        .eq('id', planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      toast.success('Diet plan deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete diet plan: ' + error.message);
    },
  });

  return {
    dietPlans: dietPlansQuery.data || [],
    isLoading: dietPlansQuery.isLoading,
    error: dietPlansQuery.error,
    createDietPlan,
    updateDietPlan,
    deleteDietPlan,
  };
}
