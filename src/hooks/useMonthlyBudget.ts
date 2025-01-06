import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UseMonthlyBudgetProps {
  date: Date;
}

export const useMonthlyBudget = ({ date }: UseMonthlyBudgetProps) => {
  // Format the month as MM (01-12)
  const month = format(date, "MM");
  const year = date.getFullYear();

  return useQuery({
    queryKey: ["monthlyBudget", month, year],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("month", month)
        .eq("year", year)
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