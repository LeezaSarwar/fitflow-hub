import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FitnessClass } from '@/hooks/useClasses';
import { useAuth } from '@/contexts/AuthContext';

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FitnessClass, 'id' | 'created_at' | 'trainer_name' | 'enrolled_count' | 'is_enrolled'>) => void;
  editingClass?: FitnessClass | null;
  isSubmitting?: boolean;
}

const CLASS_TYPES = [
  'Yoga',
  'HIIT',
  'Strength Training',
  'Cardio',
  'Pilates',
  'CrossFit',
  'Spinning',
  'Zumba',
  'Boxing',
  'Swimming',
  'Other',
];

export function ClassFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingClass,
  isSubmitting,
}: ClassFormDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schedule_date: '',
    start_time: '',
    end_time: '',
    class_type: '',
    location: '',
    max_capacity: 20,
  });

  useEffect(() => {
    if (editingClass) {
      setFormData({
        title: editingClass.title,
        description: editingClass.description || '',
        schedule_date: editingClass.schedule_date,
        start_time: editingClass.start_time.slice(0, 5),
        end_time: editingClass.end_time.slice(0, 5),
        class_type: editingClass.class_type || '',
        location: editingClass.location || '',
        max_capacity: editingClass.max_capacity || 20,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        schedule_date: '',
        start_time: '',
        end_time: '',
        class_type: '',
        location: '',
        max_capacity: 20,
      });
    }
  }, [editingClass, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || null,
      schedule_date: formData.schedule_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      class_type: formData.class_type || null,
      location: formData.location || null,
      max_capacity: formData.max_capacity,
      trainer_id: editingClass?.trainer_id || user!.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">
            {editingClass ? 'EDIT CLASS' : 'CREATE NEW CLASS'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Class Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Morning Yoga Flow"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your class..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class_type">Class Type</Label>
              <Select
                value={formData.class_type}
                onValueChange={(value) => setFormData({ ...formData, class_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Studio A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule_date">Date *</Label>
            <Input
              id="schedule_date"
              type="date"
              value={formData.schedule_date}
              onChange={(e) => setFormData({ ...formData, schedule_date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_capacity">Max Capacity</Label>
            <Input
              id="max_capacity"
              type="number"
              min={1}
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 20 })}
            />
          </div>

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
              {isSubmitting ? 'Saving...' : editingClass ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
