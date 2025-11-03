import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Titulo } from "@/pages/Titulos";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(200),
  plataforma: z.string().max(100).optional(),
  avaliacao: z.coerce.number().min(0, "Mín 0").max(10, "Máx 10").optional(),
  status: z.enum(["ASSISTINDO", "CONCLUIDO", "QUERO_VER"], {
    required_error: "Status é obrigatório.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface TituloDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: Titulo | null;
}

export const TituloDialog = ({ open, onOpenChange, titulo }: TituloDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!titulo;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      plataforma: "",
      avaliacao: 0,
      status: undefined,
    },
  });

  useEffect(() => {
    if (titulo) {
      form.reset({
        nome: titulo.nome,
        plataforma: titulo.plataforma || "",
        avaliacao: titulo.avaliacao || 0,
        status: titulo.status,
      });
    } else {
      form.reset({
        nome: "",
        plataforma: "",
        avaliacao: 0,
        status: undefined,
      });
    }
  }, [titulo, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        avaliacao: data.avaliacao || null,
        plataforma: data.plataforma || null,
      };

      if (isEditing) {
        await api.put(`/titulos/${titulo.id}`, payload);
      } else {
        await api.post("/titulos", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titulos"] });
      toast({
        title: "Sucesso!",
        description: isEditing ? "Título atualizado." : "Título cadastrado.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Ocorreu um erro.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Título" : "Novo Título"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do filme ou série" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="QUERO_VER">Quero Ver</SelectItem>
                      <SelectItem value="ASSISTINDO">Assistindo</SelectItem>
                      <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plataforma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plataforma de Streaming</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix, Prime Video, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avaliacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avaliação (0 a 10)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
