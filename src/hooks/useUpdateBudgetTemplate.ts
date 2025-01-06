import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export const useUpdateBudgetTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<Tables<"monthly_budgets">>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: session.session.user.id,
          is_template: true,
          month: "0000-00",
          year: new Date().getFullYear(),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetTemplate"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBudget"] });
    },
  });
};