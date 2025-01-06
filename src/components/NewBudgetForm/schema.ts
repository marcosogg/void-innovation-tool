import * as z from "zod";

export const budgetFormSchema = z.object({
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

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;