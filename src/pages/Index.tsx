import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasBudget, setHasBudget] = useState(false);

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

  useEffect(() => {
    const checkAndCreateBudget = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return;

        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' }).toLowerCase();
        const currentYear = currentDate.getFullYear();

        // Check if budget exists for current month
        const { data: existingBudget } = await supabase
          .from("monthly_budgets")
          .select("*")
          .eq("user_id", session.session.user.id)
          .eq("month", currentMonth)
          .eq("year", currentYear)
          .eq("is_template", false)
          .single();

        if (existingBudget) {
          setHasBudget(true);
          setLoading(false);
          return;
        }

        // If no budget exists, check for template
        const { data: template } = await supabase
          .from("monthly_budgets")
          .select("*")
          .eq("user_id", session.session.user.id)
          .eq("is_template", true)
          .eq("month", "template")
          .eq("year", currentYear)
          .single();

        if (template) {
          // Create new budget from template
          const { error: createError } = await supabase.from("monthly_budgets").insert({
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
          });

          if (createError) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create budget from template.",
            });
          } else {
            setHasBudget(true);
            toast({
              title: "Budget Created",
              description: "A new budget has been created from your template.",
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking/creating budget:", error);
        setLoading(false);
      }
    };

    checkAndCreateBudget();
  }, [toast]);

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
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : !hasBudget ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No budget exists for the current month.</p>
            <Button onClick={() => navigate("/settings")}>
              Create Budget Template
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Your budget for this month is ready!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;