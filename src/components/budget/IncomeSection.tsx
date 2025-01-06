import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type IncomeSectionProps = {
  form: UseFormReturn<any>;
};

const IncomeSection = ({ form }: IncomeSectionProps) => {
  return (
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
  );
};

export default IncomeSection;