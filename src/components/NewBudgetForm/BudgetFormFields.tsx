import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "./schema";

interface BudgetFormFieldsProps {
  form: UseFormReturn<BudgetFormValues>;
}

export const BudgetFormFields = ({ form }: BudgetFormFieldsProps) => {
  const fields = [
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => (
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
  );
};