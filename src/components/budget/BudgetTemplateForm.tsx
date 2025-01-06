import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import IncomeSection from "./IncomeSection";
import ExpensesSection from "./ExpensesSection";
import { useBudgetTemplate } from "@/hooks/useBudgetTemplate";
import { useUpdateBudgetTemplate } from "@/hooks/useUpdateBudgetTemplate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const { data: template, isLoading } = useBudgetTemplate();
  const { mutate: updateTemplate, isPending } = useUpdateBudgetTemplate();

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

  const handleSaveTemplate = (values: TemplateFormValues) => {
    updateTemplate(values, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Budget template saved successfully.",
        });
        navigate("/");
      },
      onError: (error) => {
        console.error("Error saving template:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save budget template. Please try again.",
        });
      },
    });
  };

  if (isLoading || isPending) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <IncomeSection form={form} />
        <ExpensesSection form={form} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" className="w-full">Save Template</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Budget Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to overwrite the existing template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={form.handleSubmit(handleSaveTemplate)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default BudgetTemplateForm;