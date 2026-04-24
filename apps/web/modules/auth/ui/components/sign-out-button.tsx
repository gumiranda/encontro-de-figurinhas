"use client";

import type { ComponentProps } from "react";
import { useTransition } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

type ButtonProps = ComponentProps<typeof Button>;

interface SignOutButtonProps {
  iconOnly?: boolean;
  redirectUrl?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export function SignOutButton({
  iconOnly = false,
  redirectUrl = "/",
  label = "Sair da conta",
  variant = "ghost",
  size = "lg",
  className,
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={() => startTransition(() => signOut({ redirectUrl }))}
      disabled={isPending}
      aria-label={iconOnly ? label : undefined}
      className={cn(iconOnly && "rounded-full", className)}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {!iconOnly && <span>{label}</span>}
    </Button>
  );
}
