import { useState } from "react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface BrazilianExpensesFormProps {
  date: Date;
  onSuccess?: () => void;
}

const BrazilianExpensesForm = ({ date, onSuccess }: BrazilianExpensesFormProps) => {
  const [familySupport, setFamilySupport] = useState("");
  const [bills, setBills] = useState("");
  const [services, setServices] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const month = format(date, "yyyy-MM");
      const year = date.getFullYear();
      const totalBRL = Number(familySupport) + Number(bills) + Number(services);

      // Save to brazilian_expenses table
      const { data: expenseData, error: expenseError } = await supabase
        .from("brazilian_expenses")
        .upsert({
          month,
          year,
          family_support: Number(familySupport),
          bills: Number(bills),
          services: Number(services),
          total_brl: totalBRL,
          exchange_rate: Number(exchangeRate),
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Update monthly_budget with converted total
      const totalEUR = totalBRL / Number(exchangeRate);
      const { error: budgetError } = await supabase
        .from("monthly_budgets")
        .update({
          actual_brazilian_expenses_total: totalEUR,
        })
        .eq("month", month)
        .eq("year", year)
        .eq("is_template", false);

      if (budgetError) throw budgetError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["monthlyBudget"] });
      queryClient.invalidateQueries({ queryKey: ["brazilianExpenses"] });

      toast({
        title: "Success",
        description: "Brazilian expenses have been saved.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving Brazilian expenses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save Brazilian expenses.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brazilian Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familySupport">Family Support (BRL)</Label>
            <Input
              id="familySupport"
              type="number"
              step="0.01"
              min="0"
              value={familySupport}
              onChange={(e) => setFamilySupport(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bills">Bills (BRL)</Label>
            <Input
              id="bills"
              type="number"
              step="0.01"
              min="0"
              value={bills}
              onChange={(e) => setBills(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="services">Services (BRL)</Label>
            <Input
              id="services"
              type="number"
              step="0.01"
              min="0"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exchangeRate">Exchange Rate (BRL to EUR)</Label>
            <Input
              id="exchangeRate"
              type="number"
              step="0.0001"
              min="0"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Save Brazilian Expenses
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BrazilianExpensesForm;