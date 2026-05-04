"use client";

import { useState } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Progress } from "@workspace/ui/components/progress";
import { BookOpen, Loader2, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { ROLES, SECTORS } from "@/lib/constants";
import { RoleBadge } from "@/components/role-badge";

function getSectorName(sector: string | undefined) {
  if (!sector) return "-";
  const found = SECTORS.find((s) => s.id === sector);
  return found?.name ?? sector;
}

function getCityLabel(city: { name: string; state: string } | null) {
  return city ? `${city.name} (${city.state})` : "Sem cidade";
}

function getAlbumPercent(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export default function AdminUsersPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const isSuperadmin = currentUser?.role === "superadmin";
  const isCeo = currentUser?.role === "ceo";
  const canListUsers = isSuperadmin || isCeo;
  const {
    results: users,
    status: usersStatus,
    loadMore,
  } = usePaginatedQuery(
    api.users.getAllUsers,
    canListUsers ? {} : "skip",
    { initialNumItems: 50 }
  );
  const updateUserRole = useMutation(api.users.updateUserRole);
  const updateUserSector = useMutation(api.users.updateUserSector);

  const [editingUser, setEditingUser] = useState<{
    id: Id<"users">;
    name: string;
    role?: string;
    sector?: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canListUsers) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Voce nao tem permissao para acessar esta pagina.
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
    setSelectedRole(user.role ?? "");
    setSelectedSector(user.sector ?? "");
  };

  const handleSave = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      if (isSuperadmin && selectedRole !== editingUser.role) {
        await updateUserRole({
          userId: editingUser.id,
          role: selectedRole,
        });
      }

      if (
        selectedRole === "user" &&
        selectedSector &&
        selectedSector !== editingUser.sector
      ) {
        await updateUserSector({
          userId: editingUser.id,
          sector: selectedSector,
        });
      }

      toast.success("User updated successfully");
      setEditingUser(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canEditUser = (userRole?: string) => {
    if (isSuperadmin) return true;
    if (isCeo && userRole === "user") return true;
    return false;
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
          {usersStatus === "LoadingFirstPage" ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Album</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const albumPercent = getAlbumPercent(
                      user.albumCompletionPct
                    );
                    const albumProgress = user.albumProgress ?? 0;

                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>{getSectorName(user.sector)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{getCityLabel(user.city)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-48">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span className="flex items-center gap-2 font-medium">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                {albumPercent.toFixed(1)}%
                              </span>
                              <span className="text-muted-foreground">
                                {albumProgress} completas
                              </span>
                            </div>
                            <Progress value={albumPercent} className="h-2" />
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>{user.missingCount} faltando</span>
                              <span>{user.duplicatesCount} repetidas</span>
                              {!user.hasCompletedStickerSetup && (
                                <span className="font-medium text-amber-600">
                                  setup pendente
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
              {usersStatus === "CanLoadMore" && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => loadMore(50)}>
                    Carregar mais
                  </Button>
                </div>
              )}
              {usersStatus === "LoadingMore" && (
                <div className="flex justify-center pt-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Change permissions for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isSuperadmin && (
              <div className="space-y-2">
                <label htmlFor="role-select" className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select">
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
                <label htmlFor="user-sector-select" className="text-sm font-medium">Sector</label>
                <Select
                  value={selectedSector}
                  onValueChange={setSelectedSector}
                >
                  <SelectTrigger id="user-sector-select">
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
                Superadmins e CEOs nao possuem setor associado.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
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
    </div>
  );
}
