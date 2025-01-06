import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export const useUpdateBudgetTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<Tables<"monthly_budgets">> & { month: string; year: number }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: session.session.user.id,
          is_template: true,
          ...values,
        })
        .select()
        .single();

      if (error) {
        console.error("Error updating budget template:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both template and monthly budget queries
      queryClient.invalidateQueries({ queryKey: ["budgetTemplate", variables.month, variables.year] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBudget"] });
    },
  });
};