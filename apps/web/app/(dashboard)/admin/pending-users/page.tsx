"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Check, X, Clock } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { ApproveUserDialog } from "./approve-user-dialog";
import { RejectUserDialog } from "./reject-user-dialog";

export default function PendingUsersPage() {
  const { currentUser, canManageUsers } = usePermissions();
  const pendingUsers = useQuery(api.users.getPendingUsers);

  const [approveDialog, setApproveDialog] = useState<{
    userId: Id<"users">;
    name: string;
  } | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    userId: Id<"users">;
    name: string;
  } | null>(null);

  if (!currentUser || !canManageUsers) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Users</h1>
        <p className="text-muted-foreground">
          Approve or reject access requests to the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Awaiting Approval
            {pendingUsers && pendingUsers.length > 0 && (
              <Badge variant="secondary">{pendingUsers.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Users who have requested access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users pending approval.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-amber-600">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() =>
                          setApproveDialog({ userId: user._id, name: user.name })
                        }
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          setRejectDialog({ userId: user._id, name: user.name })
                        }
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ApproveUserDialog
        user={approveDialog}
        onClose={() => setApproveDialog(null)}
      />
      <RejectUserDialog
        user={rejectDialog}
        onClose={() => setRejectDialog(null)}
      />
    </div>
  );
}
