import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

export const useCreateMonthlyBudget = () => {
  const queryClient = useQueryClient();
  const currentDate = new Date();

  return useMutation({
    mutationFn: async (template: Tables<"monthly_budgets">) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const currentMonth = format(currentDate, "yyyy-MM");
      const currentYear = currentDate.getFullYear();

      const { data, error } = await supabase
        .from("monthly_budgets")
        .insert({
          user_id: session.session.user.id,
          month: currentMonth,
          year: currentYear,
          is_template: false,
          salary_income: template.salary_income,
          bonus_income: template.bonus_income,
          extra_income: template.extra_income,
          rent: template.rent,
          utilities: template.utilities,
          groceries: template.groceries,
          transport: template.transport,
          entertainment: template.entertainment,
          shopping: template.shopping,
          miscellaneous: template.miscellaneous,
          brazilian_expenses_total: template.brazilian_expenses_total,
          savings: template.savings,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating monthly budget:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyBudget"] });
    },
  });
};