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

interface TemplateFormActionsProps {
  form: UseFormReturn<any>;
}

const TemplateFormActions = ({ form }: TemplateFormActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: updateTemplate, isPending } = useUpdateBudgetTemplate();

  const handleSaveTemplate = (values: any) => {
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="w-full" disabled={isPending}>
          Save Template
        </Button>
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
  );
};

export default TemplateFormActions;