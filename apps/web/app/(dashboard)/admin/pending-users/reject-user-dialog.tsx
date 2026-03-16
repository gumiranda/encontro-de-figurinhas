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
import { Textarea } from "@workspace/ui/components/textarea";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function RejectUserDialog({
  user,
  onClose,
}: {
  user: { userId: Id<"users">; name: string } | null;
  onClose: () => void;
}) {
  const rejectUser = useMutation(api.users.rejectUser);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReject = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await rejectUser({
        userId: user.userId,
        reason: rejectionReason || undefined,
      });
      toast.success(`User ${user.name} rejected.`);
      onClose();
      setRejectionReason("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error rejecting user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject User</DialogTitle>
          <DialogDescription>
            Reject access for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason (optional)</label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
            />
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
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
