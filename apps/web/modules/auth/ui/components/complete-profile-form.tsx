"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { celebrateMilestone } from "@/components/delight";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";

import { AvatarPicker } from "./avatar-picker";
import { NicknameInput } from "./nickname-input";

const completeProfileSchema = z.object({
  nickname: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[\p{L}\p{N}_]+$/u, "Apenas letras, números e underscore"),
  birthDate: z.date({ required_error: "Data de nascimento obrigatória" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos" }),
  }),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const completeProfile = useMutation(api.users.completeProfile);

  const form = useForm<CompleteProfileFormData>({
    mode: "onSubmit",
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      nickname: "",
      terms: undefined,
    },
  });

  const currentNickname = form.watch("nickname");

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsSubmitting(true);
    try {
      await completeProfile({
        nickname: data.nickname,
        birthDate: data.birthDate.getTime(),
      });

      celebrateMilestone("profileComplete");
      router.push("/cadastrar-figurinhas");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nickname already taken") {
          toast.error("Este apelido já está em uso. Escolha outro.");
          form.setError("nickname", { message: "Apelido indisponível" });
        } else {
          toast.error("Erro ao salvar perfil. Tente novamente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full min-w-0 space-y-8"
      >
        <AvatarPicker nickname={currentNickname} imageUrl={currentUser?.avatarUrl} />

        <div className="grid min-w-0 grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-6 md:gap-y-2">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="contents">
                <FormLabel className="font-label text-sm font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] md:col-start-1 md:row-start-1 md:self-end">
                  @username
                </FormLabel>
                <div className="md:col-start-1 md:row-start-2">
                  <FormControl>
                    <NicknameInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={() => {
                        field.onBlur();
                        void form.trigger("nickname");
                      }}
                      error={form.formState.errors.nickname?.message}
                    />
                  </FormControl>
                </div>
                <div className="md:col-start-1 md:row-start-3">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="contents">
                <FormLabel className="font-label text-sm font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] md:col-start-2 md:row-start-1 md:self-end">
                  Data de Nascimento
                </FormLabel>
                <div className="md:col-start-2 md:row-start-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full h-14 bg-[var(--surface-container-highest)] dark:bg-[var(--surface-container-highest)] border-none rounded text-left font-body font-normal px-4 justify-between hover:bg-[var(--surface-container-highest)] hover:text-[var(--on-surface)] dark:hover:bg-[var(--surface-container-highest)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:border-transparent",
                            !field.value && "text-[var(--outline)]"
                          )}
                        >
                          {field.value ? (
                            <span className="text-[var(--on-surface)]">
                              {format(field.value, "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          ) : (
                            <span>dd/mm/aaaa</span>
                          )}
                          <CalendarIcon className="h-5 w-5 text-[var(--on-surface-variant)]" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      sideOffset={8}
                      collisionPadding={16}
                      className="w-auto p-0"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        defaultMonth={new Date(2000, 0)}
                        captionLayout="dropdown"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1 px-1 md:col-start-2 md:row-start-3">
                  <p className="text-xs text-[var(--outline)]">
                    Apenas para maiores de 18 anos.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl className="shrink-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-5 w-5 border-[var(--outline-variant)] dark:bg-transparent data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] dark:data-[state=checked]:bg-[var(--primary)] focus-visible:ring-[var(--primary)]/40 focus-visible:border-[var(--primary)]"
                />
              </FormControl>
              <div className="min-w-0 flex-1">
                <FormLabel className="block w-full min-w-0 cursor-pointer text-sm font-normal leading-snug text-[var(--on-surface-variant)]">
                  Concordo com os{" "}
                  <span className="text-[var(--primary)] underline cursor-pointer">
                    Termos da Arena
                  </span>{" "}
                  e confirmo que meus dados estão corretos para trocas seguras.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-16 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary)] font-headline text-lg font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-3 shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Continuar <ArrowRight className="h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
