import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MonthlyBudgetView from "@/components/MonthlyBudgetView";
import { supabase } from "@/integrations/supabase/client";
import { useMonthlyBudget } from "@/hooks/useMonthlyBudget";
import { useBudgetTemplate } from "@/hooks/useBudgetTemplate";
import { useCreateMonthlyBudget } from "@/hooks/useCreateMonthlyBudget";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: budget,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useMonthlyBudget();

  const {
    data: template,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useBudgetTemplate();

  const { mutate: createBudget, isPending: isCreatingBudget } = useCreateMonthlyBudget();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/login");
    }
  };

  if (budgetError || templateError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load budget data. Please try again.",
    });
  }

  const isLoading = isBudgetLoading || isTemplateLoading || isCreatingBudget;

  const handleCreateFromTemplate = () => {
    if (template) {
      createBudget(template, {
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
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Settings
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <MonthlyBudgetView budget={null as any} isLoading={true} />
        ) : !budget && template ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No budget exists for the current month.</p>
            <Button onClick={handleCreateFromTemplate}>
              Create Budget from Template
            </Button>
          </div>
        ) : !budget && !template ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No budget template exists.</p>
            <Button onClick={() => navigate("/settings")}>
              Create Budget Template
            </Button>
          </div>
        ) : budget ? (
          <MonthlyBudgetView budget={budget} />
        ) : null}
      </div>
    </div>
  );
};

export default Index;