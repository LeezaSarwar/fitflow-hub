import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];

export interface AttendanceRecord {
  id: string;
  class_id: string;
  member_id: string;
  date: string;
  status: AttendanceStatus;
  qr_token: string | null;
  marked_by: string | null;
  created_at: string;
  class_title?: string;
  member_name?: string;
  marked_by_name?: string;
}

export function useAttendance() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const attendanceQuery = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      let query = supabase.from('attendance').select('*');

      // Members only see their own attendance
      if (role === 'member') {
        query = query.eq('member_id', user!.id);
      }

      const { data: records, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      // Get class titles
      const classIds = [...new Set(records.map(r => r.class_id))];
      const { data: classes } = await supabase
        .from('fitness_classes')
        .select('id, title')
        .in('id', classIds);

      // Get member names
      const memberIds = [...new Set(records.map(r => r.member_id))];
      const { data: members } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', memberIds);

      // Get marked_by names
      const markerIds = [...new Set(records.filter(r => r.marked_by).map(r => r.marked_by!))];
      const { data: markers } = markerIds.length > 0
        ? await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', markerIds)
        : { data: [] };

      return records.map(r => ({
        ...r,
        class_title: classes?.find(c => c.id === r.class_id)?.title || 'Unknown Class',
        member_name: members?.find(m => m.user_id === r.member_id)?.full_name || 'Unknown',
        marked_by_name: r.marked_by ? markers?.find(m => m.user_id === r.marked_by)?.full_name : null,
      })) as AttendanceRecord[];
    },
    enabled: !!user,
  });

  const markAttendance = useMutation({
    mutationFn: async ({
      class_id,
      member_id,
      status,
      qr_token,
    }: {
      class_id: string;
      member_id: string;
      status: AttendanceStatus;
      qr_token?: string;
    }) => {
      const { error } = await supabase
        .from('attendance')
        .insert({
          class_id,
          member_id,
          status,
          qr_token: qr_token || null,
          marked_by: user!.id,
          date: new Date().toISOString().split('T')[0],
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked successfully!');
    },
    onError: (error) => {
      toast.error('Failed to mark attendance: ' + error.message);
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AttendanceStatus;
    }) => {
      const { error } = await supabase
        .from('attendance')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update attendance: ' + error.message);
    },
  });

  const deleteAttendance = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance record deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete attendance: ' + error.message);
    },
  });

  return {
    attendance: attendanceQuery.data || [],
    isLoading: attendanceQuery.isLoading,
    error: attendanceQuery.error,
    markAttendance,
    updateAttendance,
    deleteAttendance,
  };
}
