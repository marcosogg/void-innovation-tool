import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import IncomeSection from "./IncomeSection";
import ExpensesSection from "./ExpensesSection";
import TemplateFormActions from "./TemplateFormActions";
import { useBudgetTemplate } from "@/hooks/useBudgetTemplate";
import MonthSelector from "./MonthSelector";

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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: template, isLoading } = useBudgetTemplate({ date: selectedDate });

  useEffect(() => {
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
  }, [template, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <MonthSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <IncomeSection form={form} />
        <ExpensesSection form={form} />
        <TemplateFormActions form={form} selectedDate={selectedDate} />
      </form>
    </Form>
  );
};

export default BudgetTemplateForm;
