import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];

const formSchema = z.object({
  class_id: z.string().min(1, 'Class is required'),
  member_id: z.string().min(1, 'Member is required'),
  status: z.enum(['present', 'absent', 'late']),
});

type FormData = z.infer<typeof formSchema>;

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    class_id: string;
    member_id: string;
    status: AttendanceStatus;
    qr_token?: string;
  }) => void;
  isSubmitting?: boolean;
}

export function MarkAttendanceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: MarkAttendanceDialogProps) {
  const { user, role } = useAuth();
  const [classes, setClasses] = useState<{ id: string; title: string }[]>([]);
  const [members, setMembers] = useState<{ user_id: string; full_name: string }[]>([]);
  const [qrClassId, setQrClassId] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_id: '',
      member_id: '',
      status: 'present',
    },
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch classes
      let classQuery = supabase.from('fitness_classes').select('id, title');
      if (role === 'trainer') {
        classQuery = classQuery.eq('trainer_id', user!.id);
      }
      const { data: classData } = await classQuery;
      setClasses(classData || []);

      // Fetch members
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
    }

    if (open) {
      fetchData();
      form.reset();
      setQrClassId('');
      setQrToken('');
    }
  }, [open, role, user, form]);

  const generateQRCode = () => {
    if (!qrClassId) return;
    const token = `ATT-${qrClassId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    setQrToken(token);
  };

  const handleSubmit = (data: FormData) => {
    onSubmit({
      class_id: data.class_id,
      member_id: data.member_id,
      status: data.status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Mark Attendance</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
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
                    Mark Attendance
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="qr" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Class for QR</label>
                <Select onValueChange={setQrClassId} value={qrClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateQRCode}
                disabled={!qrClassId}
                className="w-full"
              >
                Generate QR Code
              </Button>

              {qrToken && (
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg">
                  <QRCodeSVG
                    value={qrToken}
                    size={200}
                    level="H"
                    includeMargin
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Members can scan this QR code to mark their attendance
                  </p>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {qrToken}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
