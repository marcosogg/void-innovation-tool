import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BudgetHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
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
  );
};

export default BudgetHeader;