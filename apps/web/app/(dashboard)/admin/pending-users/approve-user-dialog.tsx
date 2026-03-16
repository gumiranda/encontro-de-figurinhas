"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SECTORS } from "@/lib/constants";

export function ApproveUserDialog({
  user,
  onClose,
}: {
  user: { userId: Id<"users">; name: string } | null;
  onClose: () => void;
}) {
  const approveUser = useMutation(api.users.approveUser);
  const [selectedSector, setSelectedSector] = useState<string>("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!user || !selectedSector) return;

    setIsLoading(true);
    try {
      await approveUser({
        userId: user.userId,
        sector: selectedSector as "general",
      });
      toast.success(`User ${user.name} approved successfully!`);
      onClose();
      setSelectedSector("general");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error approving user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve User</DialogTitle>
          <DialogDescription>
            Select the sector for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sector</label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => {
                  const Icon = sector.icon;
                  return (
                    <SelectItem key={sector.id} value={sector.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {sector.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading || !selectedSector}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
