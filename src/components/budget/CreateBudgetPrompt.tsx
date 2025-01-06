import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useCreateMonthlyBudget } from "@/hooks/useCreateMonthlyBudget";

interface CreateBudgetPromptProps {
  template: Tables<"monthly_budgets"> | null;
  selectedDate: Date;
}

const CreateBudgetPrompt = ({ template, selectedDate }: CreateBudgetPromptProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createBudget, isPending } = useCreateMonthlyBudget();

  const handleCreateFromTemplate = () => {
    if (template) {
      createBudget(
        { template, date: selectedDate },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "A new budget has been created from your template.",
            });
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create budget from template.",
            });
            console.error("Error creating budget:", error);
          },
        }
      );
    }
  };

  if (!template) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">No budget template exists.</p>
        <Button onClick={() => navigate("/settings")}>
          Create Budget Template
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">No budget exists for the current month.</p>
      <Button onClick={handleCreateFromTemplate} disabled={isPending}>
        Create Budget from Template
      </Button>
    </div>
  );
};

export default CreateBudgetPrompt;