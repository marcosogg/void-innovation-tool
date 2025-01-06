// hooks/useBudgetTemplate.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useBudgetTemplate = (date: Date) => {
  const month = format(date, "MM");
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
        .eq("template_month", month)
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

// hooks/useUpdateBudgetTemplate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBudgetTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values, date }: { 
      values: Partial<Tables<"monthly_budgets">>;
      date: Date;
    }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const month = format(date, "MM");
      const year = date.getFullYear();

      const { data, error } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: session.session.user.id,
          is_template: true,
          template_month: month,
          month: "0000-00",
          year: year,
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
    onSuccess: (_, { date }) => {
      const month = format(date, "MM");
      const year = date.getFullYear();
      queryClient.invalidateQueries({ 
        queryKey: ["budgetTemplate", month, year] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["monthlyBudget", month, year] 
      });
    },
  });
};
