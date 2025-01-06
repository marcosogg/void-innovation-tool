import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UseBudgetTemplateProps {
  date: Date;
}

export const useBudgetTemplate = ({ date }: UseBudgetTemplateProps) => {
  // Format the month as MM (01-12)
  const month = format(date, 'MM');
  const year = date.getFullYear();

  return useQuery({
    queryKey: ["budgetTemplate", month, year],
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
        .eq("month", month)
        .eq("year", year)
        .maybeSingle();

      if (error) {
        console.error("Error fetching budget template:", error);
        throw error;
      }

      return data;
    },
  });
};