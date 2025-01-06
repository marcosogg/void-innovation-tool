import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetFormSchema, type BudgetFormValues } from "./schema";
import { OverwriteWarning } from "./OverwriteWarning";
import { BudgetFormFields } from "./BudgetFormFields";

const NewBudgetForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [pendingData, setPendingData] = useState<BudgetFormValues | null>(null);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      year: new Date().getFullYear(),
      salary_income: 0,
      bonus_income: 0,
      extra_income: 0,
      rent: 0,
      utilities: 0,
      groceries: 0,
      transport: 0,
      entertainment: 0,
      shopping: 0,
      miscellaneous: 0,
      savings: 0,
    },
  });

  const { data: existingBudget } = useQuery({
    queryKey: ["budget", form.watch("month")],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      const [year, month] = form.watch("month").split("-");
      console.log("Month value being queried:", month);
      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("month", month.padStart(2, '0'))
        .eq("year", parseInt(year))
        .eq("profile_id", session.session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const createBudget = useMutation({
    mutationFn: async (values: BudgetFormValues) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      const total_income = values.salary_income + values.bonus_income + values.extra_income;
      const [year, month] = values.month.split("-");
      console.log("Month value being sent:", month);
      
      const { error } = await supabase.from("monthly_budgets").upsert({
        month: month.padStart(2, '0'),
        year: parseInt(year),
        salary_income: values.salary_income,
        bonus_income: values.bonus_income,
        extra_income: values.extra_income,
        total_income,
        rent: values.rent,
        utilities: values.utilities,
        groceries: values.groceries,
        transport: values.transport,
        entertainment: values.entertainment,
        shopping: values.shopping,
        miscellaneous: values.miscellaneous,
        savings: values.savings,
        brazilian_expenses_total: 0,
        profile_id: session.session.user.id,
      });

      if (error) {
        console.error("Error saving budget:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Budget has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      form.reset();
      setShowOverwriteWarning(false);
      setPendingData(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save budget. Please try again.",
      });
      console.error("Error saving budget:", error);
    },
  });

  const onSubmit = async (values: BudgetFormValues) => {
    if (existingBudget && !showOverwriteWarning) {
      setShowOverwriteWarning(true);
      setPendingData(values);
      return;
    }

    createBudget.mutate(values);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and hyphens
    const cleanValue = value.replace(/[^\d-]/g, '');
    
    // Format as YYYY-MM
    let formattedValue = cleanValue;
    if (cleanValue.length >= 4 && !cleanValue.includes('-')) {
      formattedValue = `${cleanValue.slice(0, 4)}-${cleanValue.slice(4, 6)}`;
    }
    
    return formattedValue;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Monthly Budget</h2>

      {showOverwriteWarning && (
        <OverwriteWarning
          onConfirm={(data) => createBudget.mutate(data)}
          onCancel={() => {
            setShowOverwriteWarning(false);
            setPendingData(null);
          }}
          pendingData={pendingData}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    placeholder="YYYY-MM"
                    {...field}
                    onChange={(e) => {
                      const formattedValue = handleMonthChange(e);
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BudgetFormFields form={form} />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createBudget.isPending}
            >
              {createBudget.isPending ? "Saving..." : "Save Budget"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewBudgetForm;