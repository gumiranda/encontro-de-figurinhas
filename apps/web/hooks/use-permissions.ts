"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export function usePermissions() {
  const currentUser = useQuery(api.users.getCurrentUser);

  const isSuperadmin = currentUser?.role === "superadmin";
  const isCeo = currentUser?.role === "ceo";

  return {
    currentUser,
    isSuperadmin,
    isCeo,
    canManageUsers: isSuperadmin || isCeo,
    canEditUser: (userRole?: string) => {
      if (isSuperadmin) return true;
      if (isCeo && userRole === "user") return true;
      return false;
    },
  };
}
