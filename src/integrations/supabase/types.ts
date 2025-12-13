export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          class_id: string
          created_at: string
          date: string
          id: string
          marked_by: string | null
          member_id: string
          qr_token: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          class_id: string
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          member_id: string
          qr_token?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          class_id?: string
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          member_id?: string
          qr_token?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "fitness_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_id: string
          enrolled_at: string
          id: string
          member_id: string
          status: string | null
        }
        Insert: {
          class_id: string
          enrolled_at?: string
          id?: string
          member_id: string
          status?: string | null
        }
        Update: {
          class_id?: string
          enrolled_at?: string
          id?: string
          member_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "fitness_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_progress: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          item_id: string
          item_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          item_id: string
          item_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          item_id?: string
          item_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diet_plans: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          member_id: string | null
          notes: string | null
          title: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          title: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          title?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "fitness_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      fitness_classes: {
        Row: {
          class_type: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          max_capacity: number | null
          schedule_date: string
          start_time: string
          title: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          class_type?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          max_capacity?: number | null
          schedule_date: string
          start_time: string
          title: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          class_type?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          max_capacity?: number | null
          schedule_date?: string
          start_time?: string
          title?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_diet_plans: {
        Row: {
          calories: number | null
          created_at: string
          day_of_week: number
          description: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id: string
          meal_name: string
          meal_time: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          day_of_week: number
          description: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          meal_name: string
          meal_time: string
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          day_of_week?: number
          description?: string
          goal?: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          meal_name?: string
          meal_time?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_workout_plans: {
        Row: {
          created_at: string
          day_of_week: number
          description: string | null
          duration_minutes: number | null
          exercise_name: string
          exercise_time: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id: string
          reps: number | null
          sets: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          description?: string | null
          duration_minutes?: number | null
          exercise_name: string
          exercise_time: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          reps?: number | null
          sets?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          description?: string | null
          duration_minutes?: number | null
          exercise_name?: string
          exercise_time?: string
          goal?: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          reps?: number | null
          sets?: number | null
          user_id?: string
        }
        Relationships: []
      }
      member_goals: {
        Row: {
          created_at: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal?: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          member_id: string
          payment_date: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id: string | null
          subscription_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          member_id: string
          payment_date?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          member_id?: string
          payment_date?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_trainer_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_trainer_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_trainer_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          member_id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          member_id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          member_id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          member_id: string | null
          notes: string | null
          title: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          title: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          title?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "fitness_classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "trainer" | "member"
      attendance_status: "present" | "absent" | "late"
      fitness_goal: "lose_weight" | "gain_weight" | "build_muscle"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_plan: "monthly" | "quarterly" | "yearly" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "trainer", "member"],
      attendance_status: ["present", "absent", "late"],
      fitness_goal: ["lose_weight", "gain_weight", "build_muscle"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_plan: ["monthly", "quarterly", "yearly", "custom"],
    },
  },
} as const
