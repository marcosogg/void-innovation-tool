import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BudgetTemplateForm from "@/components/budget/BudgetTemplateForm";

const Settings = () => {
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
        <BudgetTemplateForm />
      </div>
    </div>
  );
};

export default Settings;