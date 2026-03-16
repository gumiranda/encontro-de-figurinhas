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
import { Loader2, Users } from "lucide-react";
import { SECTORS } from "@/lib/constants";
import { RoleBadge } from "@/components/role-badge";
import { usePermissions } from "@/hooks/use-permissions";
import { EditUserDialog } from "./edit-user-dialog";

function getSectorName(sector: string | undefined) {
  if (!sector) return "-";
  const found = SECTORS.find((s) => s.id === sector);
  return found?.name ?? sector;
}

export default function AdminUsersPage() {
  const { currentUser, isSuperadmin, canManageUsers, canEditUser } = usePermissions();
  const users = useQuery(api.users.getAllUsers);

  const [editingUser, setEditingUser] = useState<{
    id: Id<"users">;
    name: string;
    role?: string;
    sector?: string;
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

  const handleEditUser = (user: {
    _id: Id<"users">;
    name: string;
    role?: string;
    sector?: string;
  }) => {
    setEditingUser({
      id: user._id,
      name: user.name,
      role: user.role,
      sector: user.sector,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and their permissions in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
          <CardDescription>
            {isSuperadmin
              ? "As superadmin, you can change roles and sectors of any user."
              : "As CEO, you can change sectors of regular users."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users === undefined ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell><RoleBadge role={user.role} /></TableCell>
                    <TableCell>{getSectorName(user.sector)}</TableCell>
                    <TableCell className="text-right">
                      {canEditUser(user.role) &&
                        user._id !== currentUser._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        isSuperadmin={isSuperadmin}
      />
    </div>
  );
}
