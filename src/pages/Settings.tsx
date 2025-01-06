import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      if (!session?.session?.user) {
        navigate("/login");
        return;
      }

      const { data: template, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("is_template", true)
        .eq("month", "template")
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
  }, [form, navigate, toast]);

  const onSubmit = async (values: TemplateFormValues) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      navigate("/login");
      return;
    }

    const { error } = await supabase.from("monthly_budgets").upsert({
      user_id: session.session.user.id,
      is_template: true,
      month: "template",
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
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Budget Template Settings</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Planned Income</h2>
              <FormField
                control={form.control}
                name="salary_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Income</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bonus_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Income</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="extra_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Income</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Planned Expenses</h2>
              {[
                { name: "rent", label: "Rent" },
                { name: "utilities", label: "Utilities" },
                { name: "groceries", label: "Groceries" },
                { name: "transport", label: "Transport" },
                { name: "entertainment", label: "Entertainment" },
                { name: "shopping", label: "Shopping" },
                { name: "miscellaneous", label: "Miscellaneous" },
                { name: "brazilian_expenses_total", label: "Brazilian Expenses (Total)" },
                { name: "savings", label: "Savings" },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof TemplateFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button type="submit" className="w-full">Save Template</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Settings;