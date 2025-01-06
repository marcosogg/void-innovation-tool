import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useMonthlyBudget = (date: Date) => {
  const currentMonth = format(date, "yyyy-MM");
  const currentYear = date.getFullYear();

  return useQuery({
    queryKey: ["monthlyBudget", currentMonth, currentYear],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .eq("is_template", false)
        .maybeSingle();

      if (error) {
        console.error("Error fetching monthly budget:", error);
        throw error;
      }

      return data;
    },
  });
};