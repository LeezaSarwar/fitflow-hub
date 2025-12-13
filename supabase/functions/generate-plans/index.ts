import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const goalDescriptions: Record<string, string> = {
      lose_weight: "weight loss with calorie deficit, high protein, and cardio-focused exercises",
      gain_weight: "muscle gain with calorie surplus, high protein, and strength training",
      build_muscle: "muscle building with balanced macros and progressive overload training"
    };

    const goalDesc = goalDescriptions[goal] || goalDescriptions.build_muscle;

    // Generate diet plan
    const dietPrompt = `Generate a 7-day diet plan for ${goalDesc}. 
For each day (1-7), provide exactly 5 meals with these details:
- meal_name: name of the meal (e.g., "Breakfast", "Mid-Morning Snack", "Lunch", "Afternoon Snack", "Dinner")
- meal_time: time in 24-hour format HH:MM (e.g., "07:00", "10:00", "13:00", "16:00", "19:00")
- description: what to eat with portion sizes
- calories: estimated calories (number)

Return ONLY a valid JSON array with this exact structure:
[{"day_of_week": 1, "meal_name": "Breakfast", "meal_time": "07:00", "description": "...", "calories": 400}, ...]`;

    const dietResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a certified nutritionist. Return only valid JSON arrays without markdown formatting." },
          { role: "user", content: dietPrompt }
        ],
      }),
    });

    if (!dietResponse.ok) {
      const errorText = await dietResponse.text();
      console.error("Diet API error:", dietResponse.status, errorText);
      if (dietResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to generate diet plan");
    }

    const dietData = await dietResponse.json();
    let dietContent = dietData.choices[0].message.content;
    
    // Clean JSON response
    dietContent = dietContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const dietPlans = JSON.parse(dietContent);

    // Generate workout plan
    const workoutPrompt = `Generate a 7-day workout plan for ${goalDesc}.
For each day (1-7), provide 4-6 exercises with these details:
- exercise_name: name of the exercise
- exercise_time: time in 24-hour format HH:MM when to do it (e.g., "06:00", "06:15", etc.)
- sets: number of sets (number or null for cardio)
- reps: number of reps (number or null for cardio)
- duration_minutes: duration in minutes (number or null for strength exercises)
- description: brief description of how to perform

Include rest days (day 4 and 7) with light stretching exercises.
Return ONLY a valid JSON array with this exact structure:
[{"day_of_week": 1, "exercise_name": "Push-ups", "exercise_time": "06:00", "sets": 3, "reps": 12, "duration_minutes": null, "description": "..."}, ...]`;

    const workoutResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a certified fitness trainer. Return only valid JSON arrays without markdown formatting." },
          { role: "user", content: workoutPrompt }
        ],
      }),
    });

    if (!workoutResponse.ok) {
      const errorText = await workoutResponse.text();
      console.error("Workout API error:", workoutResponse.status, errorText);
      if (workoutResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to generate workout plan");
    }

    const workoutData = await workoutResponse.json();
    let workoutContent = workoutData.choices[0].message.content;
    
    // Clean JSON response
    workoutContent = workoutContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const workoutPlans = JSON.parse(workoutContent);

    // Delete existing plans for this user
    await supabase.from("generated_diet_plans").delete().eq("user_id", userId);
    await supabase.from("generated_workout_plans").delete().eq("user_id", userId);

    // Insert diet plans
    const dietInserts = dietPlans.map((plan: any) => ({
      user_id: userId,
      goal,
      day_of_week: plan.day_of_week,
      meal_name: plan.meal_name,
      meal_time: plan.meal_time,
      description: plan.description,
      calories: plan.calories,
    }));

    const { error: dietError } = await supabase.from("generated_diet_plans").insert(dietInserts);
    if (dietError) {
      console.error("Diet insert error:", dietError);
      throw new Error("Failed to save diet plans");
    }

    // Insert workout plans
    const workoutInserts = workoutPlans.map((plan: any) => ({
      user_id: userId,
      goal,
      day_of_week: plan.day_of_week,
      exercise_name: plan.exercise_name,
      exercise_time: plan.exercise_time,
      sets: plan.sets,
      reps: plan.reps,
      duration_minutes: plan.duration_minutes,
      description: plan.description,
    }));

    const { error: workoutError } = await supabase.from("generated_workout_plans").insert(workoutInserts);
    if (workoutError) {
      console.error("Workout insert error:", workoutError);
      throw new Error("Failed to save workout plans");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-plans error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
