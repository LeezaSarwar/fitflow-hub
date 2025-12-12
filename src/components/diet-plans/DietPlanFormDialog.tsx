import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DietPlan } from '@/hooks/useDietPlans';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignment_type: z.enum(['member', 'class']),
  member_id: z.string().optional(),
  class_id: z.string().optional(),
  file_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DietPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: DietPlan | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    member_id?: string;
    class_id?: string;
    file_url?: string;
    notes?: string;
  }) => void;
  isSubmitting?: boolean;
}

export function DietPlanFormDialog({
  open,
  onOpenChange,
  plan,
  onSubmit,
  isSubmitting,
}: DietPlanFormDialogProps) {
  const { user, role } = useAuth();
  const [members, setMembers] = useState<{ user_id: string; full_name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; title: string }[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assignment_type: 'member',
      member_id: '',
      class_id: '',
      file_url: '',
      notes: '',
    },
  });

  const assignmentType = form.watch('assignment_type');

  useEffect(() => {
    if (plan) {
      form.reset({
        title: plan.title,
        description: plan.description || '',
        assignment_type: plan.class_id ? 'class' : 'member',
        member_id: plan.member_id || '',
        class_id: plan.class_id || '',
        file_url: plan.file_url || '',
        notes: plan.notes || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        assignment_type: 'member',
        member_id: '',
        class_id: '',
        file_url: '',
        notes: '',
      });
    }
  }, [plan, form]);

  useEffect(() => {
    async function fetchData() {
      // Fetch members (users with member role)
      const { data: memberRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'member');

      if (memberRoles) {
        const memberIds = memberRoles.map(r => r.user_id);
        const { data: memberProfiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', memberIds);
        setMembers(memberProfiles || []);
      }

      // Fetch classes
      let classQuery = supabase.from('fitness_classes').select('id, title');
      if (role === 'trainer') {
        classQuery = classQuery.eq('trainer_id', user!.id);
      }
      const { data: classData } = await classQuery;
      setClasses(classData || []);
    }

    if (open) {
      fetchData();
    }
  }, [open, role, user]);

  const handleSubmit = (data: FormData) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
      member_id: data.assignment_type === 'member' ? data.member_id || undefined : undefined,
      class_id: data.assignment_type === 'class' ? data.class_id || undefined : undefined,
      file_url: data.file_url || undefined,
      notes: data.notes || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {plan ? 'Edit Diet Plan' : 'Create Diet Plan'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weight Loss Diet Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the diet plan..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Individual Member</SelectItem>
                      <SelectItem value="class">Entire Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {assignmentType === 'member' && (
              <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Member</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.user_id} value={member.user_id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {assignmentType === 'class' && (
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="file_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/diet-plan.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {plan ? 'Update' : 'Create'} Plan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
