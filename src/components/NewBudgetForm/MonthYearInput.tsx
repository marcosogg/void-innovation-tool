import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "./schema";

interface MonthYearInputProps {
  form: UseFormReturn<BudgetFormValues>;
}

export const MonthYearInput = ({ form }: MonthYearInputProps) => {
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      form.setValue("month", value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2000 && value <= 2100) {
      form.setValue("year", value);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="month"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Month (1-12)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={12}
                {...field}
                onChange={handleMonthChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={2000}
                max={2100}
                {...field}
                onChange={handleYearChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};