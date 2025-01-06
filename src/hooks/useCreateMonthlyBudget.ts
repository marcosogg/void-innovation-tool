import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface CreateBudgetParams {
  template: Tables<"monthly_budgets">;
  date: Date;
}

export const useCreateMonthlyBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ template, date }: CreateBudgetParams) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const month = format(date, "yyyy-MM");
      const year = date.getFullYear();

      // First check if a budget already exists for this month
      const { data: existingBudget } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("month", month)
        .eq("year", year)
        .eq("is_template", false)
        .maybeSingle();

      // If a budget already exists, return it
      if (existingBudget) {
        return existingBudget;
      }

      // If no budget exists, create a new one
      const { data, error } = await supabase
        .from("monthly_budgets")
        .insert({
          user_id: session.session.user.id,
          month,
          year,
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
          actual_salary_income: 0,
          actual_bonus_income: 0,
          actual_extra_income: 0,
          actual_rent: 0,
          actual_utilities: 0,
          actual_groceries: 0,
          actual_transport: 0,
          actual_entertainment: 0,
          actual_shopping: 0,
          actual_miscellaneous: 0,
          actual_brazilian_expenses_total: 0,
          actual_savings: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating monthly budget:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, { date }) => {
      const month = format(date, "yyyy-MM");
      const year = date.getFullYear();
      queryClient.invalidateQueries({ queryKey: ["monthlyBudget", month, year] });
    },
  });
};