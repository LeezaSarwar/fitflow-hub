import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FitnessClass {
  id: string;
  title: string;
  description: string | null;
  trainer_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  class_type: string | null;
  location: string | null;
  max_capacity: number | null;
  created_at: string;
  trainer_name?: string;
  enrolled_count?: number;
  is_enrolled?: boolean;
}

export function useClasses() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const classesQuery = useQuery({
    queryKey: ['fitness-classes'],
    queryFn: async () => {
      const { data: classes, error } = await supabase
        .from('fitness_classes')
        .select('*')
        .order('schedule_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Get trainer profiles for names
      const trainerIds = [...new Set(classes.map(c => c.trainer_id))];
      const { data: trainers } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', trainerIds);

      // Get enrollment counts
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id, member_id');

      // Check user's enrollments
      const userEnrollments = enrollments?.filter(e => e.member_id === user?.id) || [];

      return classes.map(c => ({
        ...c,
        trainer_name: trainers?.find(t => t.user_id === c.trainer_id)?.full_name || 'Unknown',
        enrolled_count: enrollments?.filter(e => e.class_id === c.id).length || 0,
        is_enrolled: userEnrollments.some(e => e.class_id === c.id),
      })) as FitnessClass[];
    },
    enabled: !!user,
  });

  const createClass = useMutation({
    mutationFn: async (classData: Omit<FitnessClass, 'id' | 'created_at' | 'trainer_name' | 'enrolled_count' | 'is_enrolled'>) => {
      const { error } = await supabase
        .from('fitness_classes')
        .insert(classData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-classes'] });
      toast.success('Class created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create class: ' + error.message);
    },
  });

  const updateClass = useMutation({
    mutationFn: async ({ id, ...classData }: Partial<FitnessClass> & { id: string }) => {
      const { error } = await supabase
        .from('fitness_classes')
        .update(classData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-classes'] });
      toast.success('Class updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update class: ' + error.message);
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from('fitness_classes')
        .delete()
        .eq('id', classId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-classes'] });
      toast.success('Class deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete class: ' + error.message);
    },
  });

  const enrollInClass = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({ class_id: classId, member_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-classes'] });
      toast.success('Successfully enrolled in class!');
    },
    onError: (error) => {
      toast.error('Failed to enroll: ' + error.message);
    },
  });

  const unenrollFromClass = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from('class_enrollments')
        .delete()
        .eq('class_id', classId)
        .eq('member_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-classes'] });
      toast.success('Successfully unenrolled from class!');
    },
    onError: (error) => {
      toast.error('Failed to unenroll: ' + error.message);
    },
  });

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    error: classesQuery.error,
    createClass,
    updateClass,
    deleteClass,
    enrollInClass,
    unenrollFromClass,
  };
}
