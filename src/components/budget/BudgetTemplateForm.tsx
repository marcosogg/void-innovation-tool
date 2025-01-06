// components/budget/BudgetTemplateForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import MonthSelector from "./MonthSelector";
import { Form } from "@/components/ui/form";
import IncomeSection from "./IncomeSection";
import ExpensesSection from "./ExpensesSection";
import TemplateFormActions from "./TemplateFormActions";
import { useBudgetTemplate } from "@/hooks/useBudgetTemplate";

interface BudgetTemplateFormProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const BudgetTemplateForm = ({ selectedDate, onDateChange }: BudgetTemplateFormProps) => {
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
        <div className="mb-6">
          <MonthSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        </div>
        <IncomeSection form={form} />
        <ExpensesSection form={form} />
        <TemplateFormActions form={form} selectedDate={selectedDate} />
      </form>
    </Form>
  );
};

// components/budget/TemplateFormActions.tsx
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUpdateBudgetTemplate } from "@/hooks/useUpdateBudgetTemplate";

interface TemplateFormActionsProps {
  form: UseFormReturn<any>;
  selectedDate: Date;
}

const TemplateFormActions = ({ form, selectedDate }: TemplateFormActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: updateTemplate, isPending } = useUpdateBudgetTemplate();

  const handleSaveTemplate = (values: any) => {
    updateTemplate(
      { values, date: selectedDate },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Budget template saved successfully.",
          });
          navigate("/");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save budget template.",
          });
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="w-full" disabled={isPending}>
          Save Template for {format(selectedDate, "MMMM yyyy")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Budget Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save this template for {format(selectedDate, "MMMM yyyy")}?
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
  );
};

// pages/Settings.tsx
const Settings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Budget Template Settings</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
        <BudgetTemplateForm 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};
