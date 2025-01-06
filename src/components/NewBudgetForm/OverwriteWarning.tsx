import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BudgetFormValues } from "./schema";

interface OverwriteWarningProps {
  onConfirm: (data: BudgetFormValues) => void;
  onCancel: () => void;
  pendingData: BudgetFormValues | null;
}

export const OverwriteWarning = ({ onConfirm, onCancel, pendingData }: OverwriteWarningProps) => (
  <Alert className="mb-6">
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>
      A budget already exists for this month. Do you want to overwrite it?
      <div className="mt-4 flex gap-4">
        <Button
          variant="destructive"
          onClick={() => {
            if (pendingData) {
              onConfirm(pendingData);
            }
          }}
        >
          Overwrite
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </AlertDescription>
  </Alert>
);