import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/_generated/api";
import { Role } from "@workspace/backend/lib/types";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

function isAdminRole(role: string | undefined): boolean {
  return role === Role.SUPERADMIN || role === Role.CEO;
}

/**
 * Server-side gate for /admin/*. Client-side nav hiding in the shell is UX only;
 * this runs before the route renders so direct URL access is blocked.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/sign-in");
  }

  const currentUser = await fetchQuery(api.users.getCurrentUser, {}, { token });

  if (currentUser === null) {
    redirect("/complete-profile");
  }

  if (!currentUser.hasCompletedOnboarding) {
    redirect("/complete-profile");
  }

  if (!isAdminRole(currentUser.role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
