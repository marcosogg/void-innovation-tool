import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ExpensesSectionProps = {
  form: UseFormReturn<any>;
};

const ExpensesSection = ({ form }: ExpensesSectionProps) => {
  const expenseFields = [
    { name: "rent", label: "Rent" },
    { name: "utilities", label: "Utilities" },
    { name: "groceries", label: "Groceries" },
    { name: "transport", label: "Transport" },
    { name: "entertainment", label: "Entertainment" },
    { name: "shopping", label: "Shopping" },
    { name: "miscellaneous", label: "Miscellaneous" },
    { name: "brazilian_expenses_total", label: "Brazilian Expenses (Total)" },
    { name: "savings", label: "Savings" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Planned Expenses</h2>
      {expenseFields.map(({ name, label }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
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
  );
};

export default ExpensesSection;