
-- Create enum for fitness goals
CREATE TYPE public.fitness_goal AS ENUM ('lose_weight', 'gain_weight', 'build_muscle');

-- Member goals table
CREATE TABLE public.member_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  goal fitness_goal NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goal" ON public.member_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goal" ON public.member_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goal" ON public.member_goals FOR UPDATE USING (auth.uid() = user_id);

-- Generated diet plans (auto-generated based on goal)
CREATE TABLE public.generated_diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal fitness_goal NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  meal_name TEXT NOT NULL,
  meal_time TIME NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_diet_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their diet plans" ON public.generated_diet_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their diet plans" ON public.generated_diet_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Generated workout plans (auto-generated based on goal)
CREATE TABLE public.generated_workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal fitness_goal NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  exercise_name TEXT NOT NULL,
  exercise_time TIME NOT NULL,
  sets INTEGER,
  reps INTEGER,
  duration_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workout plans" ON public.generated_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their workout plans" ON public.generated_workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily progress tracking
CREATE TABLE public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  item_type TEXT NOT NULL CHECK (item_type IN ('diet', 'workout')),
  item_id UUID NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, item_type, item_id)
);

ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their progress" ON public.daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their progress" ON public.daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their progress" ON public.daily_progress FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for daily_progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_progress;

-- Trigger for updated_at
CREATE TRIGGER update_member_goals_updated_at BEFORE UPDATE ON public.member_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_progress_updated_at BEFORE UPDATE ON public.daily_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
