import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Search, UtensilsCrossed, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useDietPlans, DietPlan } from '@/hooks/useDietPlans';
import { DietPlanCard } from '@/components/diet-plans/DietPlanCard';
import { DietPlanFormDialog } from '@/components/diet-plans/DietPlanFormDialog';

export default function DietPlansPage() {
  const { user, role, loading } = useAuth();
  const { dietPlans, isLoading, createDietPlan, updateDietPlan, deleteDietPlan } = useDietPlans();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const canManagePlans = role === 'admin' || role === 'trainer';

  const filteredPlans = dietPlans.filter((plan) =>
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.trainer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.member_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.class_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlan = (data: Parameters<typeof createDietPlan.mutate>[0]) => {
    createDietPlan.mutate(data);
  };

  const handleUpdatePlan = (data: Parameters<typeof createDietPlan.mutate>[0]) => {
    if (editingPlan) {
      updateDietPlan.mutate({ id: editingPlan.id, ...data });
    }
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this diet plan?')) {
      deleteDietPlan.mutate(planId);
    }
  };

  const handleEdit = (plan: DietPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
              Diet Plans
            </h1>
            <p className="text-muted-foreground">
              {role === 'member'
                ? 'View and download your assigned diet plans'
                : 'Manage and assign diet plans to members'}
            </p>
          </div>
          {canManagePlans && (
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Plan
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search diet plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-display text-xl mb-2">No diet plans found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search'
                : role === 'member'
                ? 'No diet plans have been assigned to you yet'
                : 'Create your first diet plan to get started'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <DietPlanCard
                key={plan.id}
                plan={plan}
                role={role}
                onEdit={handleEdit}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <DietPlanFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingPlan(null);
        }}
        plan={editingPlan}
        onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
        isSubmitting={createDietPlan.isPending || updateDietPlan.isPending}
      />
    </DashboardLayout>
  );
}
