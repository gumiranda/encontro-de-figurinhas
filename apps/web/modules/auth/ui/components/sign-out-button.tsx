"use client";

import { useTransition } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "transparent"
  | "gradient"
  | "tertiary"
  | "success"
  | "warning";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface SignOutButtonProps {
  iconOnly?: boolean;
  redirectUrl?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
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

  const handleClick = () => {
    startTransition(async () => {
      await signOut({ redirectUrl });
    });
  };

  const resolvedSize: ButtonSize = iconOnly ? "icon" : size;

  return (
    <Button
      type="button"
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
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
