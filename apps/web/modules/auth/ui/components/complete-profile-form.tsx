"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { CalendarIcon, Loader2, Zap } from "lucide-react";

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

import { NicknameInput } from "./nickname-input";
import { CityAutocomplete } from "./city-autocomplete";
import { Id } from "@workspace/backend/_generated/dataModel";

const completeProfileSchema = z.object({
  nickname: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[\p{L}\p{N}_]+$/u, "Apenas letras, números e underscore"),
  birthDate: z.date({ required_error: "Data de nascimento obrigatória" }),
  cityId: z.string().min(1, "Selecione sua cidade"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos" }),
  }),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

const NICKNAME_TAKEN_MSG = "Este apelido já está em uso. Escolha outro.";

export function CompleteProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const completeProfile = useMutation(api.users.completeProfile);

  const form = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      nickname: "",
      cityId: "",
      terms: undefined,
    },
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    if (isNicknameAvailable === false) {
      toast.error(NICKNAME_TAKEN_MSG);
      return;
    }

    setIsSubmitting(true);
    try {
      await completeProfile({
        nickname: data.nickname,
        birthDate: data.birthDate.getTime(),
        cityId: data.cityId as Id<"cities">,
      });

      toast.success("Perfil completo! Bem-vindo à Arena.");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nickname already taken") {
          toast.error(NICKNAME_TAKEN_MSG);
          form.setError("nickname", { message: "Apelido indisponível" });
        } else if (error.message === "City not found") {
          toast.error("Cidade não encontrada. Selecione novamente.");
          form.setError("cityId", { message: "Cidade inválida" });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-sm font-semibold uppercase tracking-wider text-[var(--landing-on-surface-variant)]">
                Apelido (Nickname)
              </FormLabel>
              <FormControl>
                <NicknameInput
                  value={field.value}
                  onChange={field.onChange}
                  onAvailabilityChange={setIsNicknameAvailable}
                  error={form.formState.errors.nickname?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-label text-sm font-semibold uppercase tracking-wider text-[var(--landing-on-surface-variant)]">
                Data de Nascimento
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-14 bg-[var(--landing-surface-container-highest)] dark:bg-[var(--landing-surface-container-highest)] border-none rounded text-left font-body font-normal px-4 justify-between hover:bg-[var(--landing-surface-container-highest)] hover:text-[var(--landing-on-surface)] dark:hover:bg-[var(--landing-surface-container-highest)] focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)]/40 focus-visible:border-transparent",
                        !field.value && "text-[var(--landing-outline)]"
                      )}
                    >
                      {field.value ? (
                        <span className="text-[var(--landing-on-surface)]">
                          {format(field.value, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span>dd/mm/aaaa</span>
                      )}
                      <CalendarIcon className="h-5 w-5 text-[var(--landing-on-surface-variant)]" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <p className="text-[var(--landing-outline)] text-xs mt-1 px-1">
                Apenas para maiores de 18 anos.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-sm font-semibold uppercase tracking-wider text-[var(--landing-on-surface-variant)]">
                Cidade
              </FormLabel>
              <FormControl>
                <CityAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.cityId?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1 h-5 w-5 border-[var(--landing-outline-variant)] dark:bg-transparent data-[state=checked]:bg-[var(--landing-primary)] data-[state=checked]:border-[var(--landing-primary)] dark:data-[state=checked]:bg-[var(--landing-primary)] focus-visible:ring-[var(--landing-primary)]/40 focus-visible:border-[var(--landing-primary)]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-[var(--landing-on-surface-variant)] leading-relaxed font-normal cursor-pointer">
                    Concordo com os{" "}
                    <span className="text-[var(--landing-primary)] underline cursor-pointer">
                      Termos da Arena
                    </span>{" "}
                    e confirmo que meus dados estão corretos para trocas seguras.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-8">
          <Button
            type="submit"
            disabled={isSubmitting || isNicknameAvailable === false}
            className="w-full h-16 bg-gradient-to-r from-[var(--landing-primary)] to-[var(--landing-primary-dim)] text-[var(--landing-on-primary)] font-headline text-lg font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-3 shadow-xl shadow-[var(--landing-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Entrar na Arena
                <Zap className="h-6 w-6" />
              </>
            )}
          </Button>
          <div className="flex items-center justify-center mt-6 gap-2">
            <div className="h-[1px] w-8 bg-[var(--landing-outline-variant)]/30" />
            <p className="text-[10px] text-[var(--landing-outline)] uppercase tracking-widest font-bold">
              Protocolo de Segurança Ativo
            </p>
            <div className="h-[1px] w-8 bg-[var(--landing-outline-variant)]/30" />
          </div>
        </div>
      </form>
    </Form>
  );
}
