import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import IncomeSection from "./IncomeSection";
import ExpensesSection from "./ExpensesSection";

type TemplateFormValues = {
  salary_income: number;
  bonus_income: number;
  extra_income: number;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  brazilian_expenses_total: number;
  savings: number;
};

const BudgetTemplateForm = () => {
  const { toast } = useToast();
  const form = useForm<TemplateFormValues>({
    defaultValues: {
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
      brazilian_expenses_total: 0,
      savings: 0,
    },
  });

  useEffect(() => {
    const loadTemplate = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data: template, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("is_template", true)
        .eq("month", "0000-00")
        .eq("year", new Date().getFullYear())
        .maybeSingle();

      if (error) {
        console.error("Error loading template:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load budget template.",
        });
        return;
      }

      if (template) {
        form.reset({
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
        });
      }
    };

    loadTemplate();
  }, [form, toast]);

  const onSubmit = async (values: TemplateFormValues) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { error } = await supabase.from("monthly_budgets").upsert({
      user_id: session.session.user.id,
      is_template: true,
      month: "0000-00",
      year: new Date().getFullYear(),
      ...values,
    });

    if (error) {
      console.error("Error saving template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save budget template. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Budget template saved successfully.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <IncomeSection form={form} />
        <ExpensesSection form={form} />
        <Button type="submit" className="w-full">Save Template</Button>
      </form>
    </Form>
  );
};

export default BudgetTemplateForm;