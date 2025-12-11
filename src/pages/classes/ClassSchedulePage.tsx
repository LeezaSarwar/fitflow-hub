import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useClasses, FitnessClass } from '@/hooks/useClasses';
import { useAuth } from '@/contexts/AuthContext';
import { ClassCard } from '@/components/classes/ClassCard';
import { ClassFormDialog } from '@/components/classes/ClassFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar, Loader2 } from 'lucide-react';
import { format, parseISO, isToday, isFuture, isPast, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export default function ClassSchedulePage() {
  const { role, user } = useAuth();
  const { classes, isLoading, createClass, updateClass, deleteClass, enrollInClass, unenrollFromClass } = useClasses();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FitnessClass | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'today' | 'week' | 'all'>('upcoming');

  const classTypes = useMemo(() => {
    const types = new Set(classes.map(c => c.class_type).filter(Boolean));
    return Array.from(types) as string[];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    let filtered = classes;

    // Filter by trainer if trainer role
    if (role === 'trainer') {
      filtered = filtered.filter(c => c.trainer_id === user?.id);
    }

    // Filter by view mode
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    switch (viewMode) {
      case 'today':
        filtered = filtered.filter(c => isToday(parseISO(c.schedule_date)));
        break;
      case 'week':
        filtered = filtered.filter(c => 
          isWithinInterval(parseISO(c.schedule_date), { start: weekStart, end: weekEnd })
        );
        break;
      case 'upcoming':
        filtered = filtered.filter(c => 
          isFuture(parseISO(c.schedule_date)) || isToday(parseISO(c.schedule_date))
        );
        break;
      case 'all':
      default:
        break;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.trainer_name?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query)
      );
    }

    // Filter by class type
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(c => c.class_type === typeFilter);
    }

    return filtered;
  }, [classes, viewMode, searchQuery, typeFilter, role, user?.id]);

  const handleCreateClass = (data: any) => {
    createClass.mutate(data, {
      onSuccess: () => setIsFormOpen(false),
    });
  };

  const handleUpdateClass = (data: any) => {
    if (editingClass) {
      updateClass.mutate({ id: editingClass.id, ...data }, {
        onSuccess: () => {
          setEditingClass(null);
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleEditClick = (fitnessClass: FitnessClass) => {
    setEditingClass(fitnessClass);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteClass.mutate(classId);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-wider mb-2">CLASS SCHEDULE</h1>
            <p className="text-muted-foreground">
              {role === 'member' 
                ? 'Browse and enroll in fitness classes' 
                : role === 'trainer'
                ? 'Manage your fitness classes'
                : 'Manage all gym classes'}
            </p>
          </div>

          {(role === 'admin' || role === 'trainer') && (
            <Button onClick={() => { setEditingClass(null); setIsFormOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Class
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="stat-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {classTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full lg:w-auto">
              <TabsList className="grid grid-cols-4 w-full lg:w-auto">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="stat-card text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-display text-xl mb-2">NO CLASSES FOUND</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : role === 'admin' || role === 'trainer'
                ? 'Create your first class to get started'
                : 'Check back later for new classes'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClasses.map((fitnessClass) => (
              <ClassCard
                key={fitnessClass.id}
                fitnessClass={fitnessClass}
                role={role}
                onEnroll={(id) => enrollInClass.mutate(id)}
                onUnenroll={(id) => unenrollFromClass.mutate(id)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isEnrolling={enrollInClass.isPending || unenrollFromClass.isPending}
              />
            ))}
          </div>
        )}

        {/* Summary for members */}
        {role === 'member' && classes.some(c => c.is_enrolled) && (
          <div className="stat-card">
            <h2 className="font-display text-xl tracking-wider mb-4">YOUR ENROLLED CLASSES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.filter(c => c.is_enrolled).map((c) => (
                <div key={c.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(c.schedule_date), 'MMM d')} • {c.start_time.slice(0, 5)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ClassFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
        editingClass={editingClass}
        isSubmitting={createClass.isPending || updateClass.isPending}
      />
    </DashboardLayout>
  );
}
