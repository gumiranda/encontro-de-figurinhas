"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ROLES, SECTORS } from "@/lib/constants";

type EditingUser = {
  id: Id<"users">;
  name: string;
  role?: string;
  sector?: string;
};

export function EditUserDialog({
  user,
  onClose,
  isSuperadmin,
}: {
  user: EditingUser | null;
  onClose: () => void;
  isSuperadmin: boolean;
}) {
  const updateUserRole = useMutation(api.users.updateUserRole);
  const updateUserSector = useMutation(api.users.updateUserSector);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role ?? "");
      setSelectedSector(user.sector ?? "");
    }
  }, [user]);

  const handleOpen = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (isSuperadmin && selectedRole !== user.role) {
        await updateUserRole({
          userId: user.id,
          role: selectedRole as "superadmin" | "ceo" | "user",
        });
      }

      if (
        selectedRole === "user" &&
        selectedSector &&
        selectedSector !== user.sector
      ) {
        await updateUserSector({
          userId: user.id,
          sector: selectedSector as "general",
        });
      }

      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Change permissions for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isSuperadmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {role.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedRole === "user" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select
                value={selectedSector}
                onValueChange={setSelectedSector}
              >
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
          )}

          {(selectedRole === "superadmin" || selectedRole === "ceo") && (
            <p className="text-sm text-muted-foreground">
              Superadmins and CEOs don't have an associated sector.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
