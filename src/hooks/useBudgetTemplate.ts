import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBudgetTemplate = () => {
  return useQuery({
    queryKey: ["budgetTemplate"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("is_template", true)
        .eq("month", "0000-00")
        .eq("year", new Date().getFullYear())
        .maybeSingle();

      if (error) {
        console.error("Error fetching budget template:", error);
        throw error;
      }

      return data;
    },
  });
};