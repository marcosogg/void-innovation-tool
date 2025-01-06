import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MonthlyBudgetView from "@/components/MonthlyBudgetView";
import { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasBudget, setHasBudget] = useState(false);
  const [budget, setBudget] = useState<Tables<"monthly_budgets"> | null>(null);

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

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setLoading(false);
        return;
      }

      const currentDate = new Date();
      const currentMonth = format(currentDate, 'yyyy-MM');
      const currentYear = currentDate.getFullYear();

      // Check if budget exists for current month using maybeSingle()
      const { data: existingBudget, error: existingBudgetError } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .eq("is_template", false)
        .maybeSingle();

      if (existingBudgetError) {
        console.error("Error checking existing budget:", existingBudgetError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check existing budget.",
        });
        setLoading(false);
        return;
      }

      if (existingBudget) {
        setHasBudget(true);
        setBudget(existingBudget);
        setLoading(false);
        return;
      }

      // If no budget exists, check for template using maybeSingle()
      const { data: template, error: templateError } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("is_template", true)
        .eq("month", "0000-00")
        .eq("year", currentYear)
        .maybeSingle();

      if (templateError) {
        console.error("Error checking template:", templateError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check budget template.",
        });
        setLoading(false);
        return;
      }

      if (template) {
        // Create new budget from template
        const { data: newBudget, error: createError } = await supabase
          .from("monthly_budgets")
          .insert({
            user_id: session.session.user.id,
            month: currentMonth,
            year: currentYear,
            is_template: false,
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
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating budget from template:", createError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create budget from template.",
          });
        } else {
          setHasBudget(true);
          setBudget(newBudget);
          toast({
            title: "Budget Created",
            description: "A new budget has been created from your template.",
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error checking/creating budget:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      setLoading(false);
    }
  };

  // Fetch data when component mounts and when focus returns to the window
  useEffect(() => {
    fetchBudgetData();

    // Add event listener for when the window regains focus
    window.addEventListener('focus', fetchBudgetData);

    // Cleanup
    return () => {
      window.removeEventListener('focus', fetchBudgetData);
    };
  }, []); // Empty dependency array as we want this to run only once on mount

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
        
        {loading ? (
          <MonthlyBudgetView budget={null as any} isLoading={true} />
        ) : !hasBudget ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No budget exists for the current month.</p>
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