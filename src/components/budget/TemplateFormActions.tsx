import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TemplateFormActionsProps {
  form: UseFormReturn<any>;
  selectedDate: Date;
}

const TemplateFormActions = ({ form, selectedDate }: TemplateFormActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: updateTemplate, isPending } = useUpdateBudgetTemplate();

  const handleSaveTemplate = (values: any) => {
    const month = format(selectedDate, "yyyy-MM");
    const year = selectedDate.getFullYear();

    updateTemplate(
      { ...values, month, year },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Budget template for ${format(selectedDate, "MMMM yyyy")} saved successfully.`,
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
            This will overwrite any existing template for this month.
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

export default TemplateFormActions;