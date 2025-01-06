import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type MonthlyBudget = Tables<"monthly_budgets">;

interface BudgetItemProps {
  label: string;
  planned: number;
  actual: number;
}

const BudgetItem = ({ label, planned, actual }: BudgetItemProps) => {
  const remaining = planned - actual;
  const progress = planned > 0 ? (actual / planned) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          €{actual.toFixed(2)} / €{planned.toFixed(2)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-xs text-muted-foreground text-right">
        Remaining: €{remaining.toFixed(2)}
      </div>
    </div>
  );
};

interface MonthlyBudgetViewProps {
  budget: MonthlyBudget;
  isLoading?: boolean;
}

const MonthlyBudgetView = ({ budget, isLoading }: MonthlyBudgetViewProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const totalPlannedIncome =
    budget.salary_income + budget.bonus_income + budget.extra_income;
  const totalActualIncome =
    budget.actual_salary_income + budget.actual_bonus_income + budget.actual_extra_income;
  const remainingIncome = totalPlannedIncome - totalActualIncome;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BudgetItem
              label="Salary"
              planned={budget.salary_income}
              actual={budget.actual_salary_income}
            />
            <BudgetItem
              label="Bonus"
              planned={budget.bonus_income}
              actual={budget.actual_bonus_income}
            />
            <BudgetItem
              label="Extra Income"
              planned={budget.extra_income}
              actual={budget.actual_extra_income}
            />
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Income</span>
                <span>
                  €{totalActualIncome.toFixed(2)} / €{totalPlannedIncome.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground text-right mt-1">
                Remaining: €{remainingIncome.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetItem
              label="Savings"
              planned={budget.savings}
              actual={budget.actual_savings}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BudgetItem
            label="Rent"
            planned={budget.rent}
            actual={budget.actual_rent}
          />
          <BudgetItem
            label="Utilities"
            planned={budget.utilities}
            actual={budget.actual_utilities}
          />
          <BudgetItem
            label="Groceries"
            planned={budget.groceries}
            actual={budget.actual_groceries}
          />
          <BudgetItem
            label="Transport"
            planned={budget.transport}
            actual={budget.actual_transport}
          />
          <BudgetItem
            label="Entertainment"
            planned={budget.entertainment}
            actual={budget.actual_entertainment}
          />
          <BudgetItem
            label="Shopping"
            planned={budget.shopping}
            actual={budget.actual_shopping}
          />
          <BudgetItem
            label="Miscellaneous"
            planned={budget.miscellaneous}
            actual={budget.actual_miscellaneous}
          />
          <BudgetItem
            label="Brazilian Expenses"
            planned={budget.brazilian_expenses_total}
            actual={budget.actual_brazilian_expenses_total}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyBudgetView;