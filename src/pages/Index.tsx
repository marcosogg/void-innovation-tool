import { useState } from "react";
import MonthlyBudgetView from "@/components/MonthlyBudgetView";
import { useMonthlyBudget } from "@/hooks/useMonthlyBudget";
import { useBudgetTemplate } from "@/hooks/useBudgetTemplate";
import BudgetHeader from "@/components/budget/BudgetHeader";
import CreateBudgetPrompt from "@/components/budget/CreateBudgetPrompt";
import MonthSelector from "@/components/budget/MonthSelector";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: budget,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useMonthlyBudget({ date: selectedDate });

  const {
    data: template,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useBudgetTemplate();

  const isLoading = isBudgetLoading || isTemplateLoading;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <BudgetHeader />
        <MonthSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        
        {isLoading ? (
          <MonthlyBudgetView budget={null as any} isLoading={true} selectedDate={selectedDate} />
        ) : !budget && template ? (
          <CreateBudgetPrompt template={template} selectedDate={selectedDate} />
        ) : !budget && !template ? (
          <CreateBudgetPrompt template={null} selectedDate={selectedDate} />
        ) : budget ? (
          <MonthlyBudgetView budget={budget} selectedDate={selectedDate} />
        ) : null}
      </div>
    </div>
  );
};

export default Index;