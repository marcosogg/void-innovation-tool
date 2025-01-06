import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UseBrazilianExpensesProps {
  date: Date;
}

export const useBrazilianExpenses = ({ date }: UseBrazilianExpensesProps) => {
  const month = format(date, "yyyy-MM");
  const year = date.getFullYear();

  return useQuery({
    queryKey: ["brazilianExpenses", month, year],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("brazilian_expenses")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("month", month)
        .eq("year", year)
        .maybeSingle();

      if (error) {
        console.error("Error fetching Brazilian expenses:", error);
        throw error;
      }

      return data;
    },
  });
};