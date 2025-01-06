import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const budgetFormSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  year: z.number().int().min(2000).max(2100),
  salary_income: z.number().min(0),
  bonus_income: z.number().min(0),
  extra_income: z.number().min(0),
  rent: z.number().min(0),
  utilities: z.number().min(0),
  groceries: z.number().min(0),
  transport: z.number().min(0),
  entertainment: z.number().min(0),
  shopping: z.number().min(0),
  miscellaneous: z.number().min(0),
  savings: z.number().min(0),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

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
      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("month", month)
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
      
      const { error } = await supabase.from("monthly_budgets").upsert({
        month: month,
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
        brazilian_expenses_total: 0, // This will be updated separately
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Monthly Budget</h2>

      {showOverwriteWarning && (
        <Alert className="mb-6">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            A budget already exists for this month. Do you want to overwrite it?
            <div className="mt-4 flex gap-4">
              <Button
                variant="destructive"
                onClick={() => {
                  if (pendingData) {
                    createBudget.mutate(pendingData);
                  }
                }}
              >
                Overwrite
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowOverwriteWarning(false);
                  setPendingData(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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
                  <Input type="month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "salary_income", label: "Salary Income (EUR)" },
              { name: "bonus_income", label: "Bonus Income (EUR)" },
              { name: "extra_income", label: "Extra Income (EUR)" },
              { name: "rent", label: "Rent (EUR)" },
              { name: "utilities", label: "Utilities (EUR)" },
              { name: "groceries", label: "Groceries (EUR)" },
              { name: "transport", label: "Transport (EUR)" },
              { name: "entertainment", label: "Entertainment (EUR)" },
              { name: "shopping", label: "Shopping (EUR)" },
              { name: "miscellaneous", label: "Miscellaneous (EUR)" },
              { name: "savings", label: "Savings (EUR)" },
            ].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof BudgetFormValues}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...formField}
                        onChange={(e) => {
                          formField.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

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
