import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PacientesList } from "@/components/pacientes/PacientesList";
import { PacienteDialog } from "@/components/pacientes/PacienteDialog";
import { DeleteDialog } from "@/components/pacientes/DeleteDialog";

export interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

const Pacientes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [pacienteToDelete, setPacienteToDelete] = useState<Paciente | null>(null);
  const queryClient = useQueryClient();

  const { data: pacientes, isLoading } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Paciente[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("pacientes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      toast({
        title: "Sucesso!",
        description: "Paciente excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setPacienteToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o paciente.",
        variant: "destructive",
      });
      console.error("Erro ao excluir paciente:", error);
    },
  });

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setIsDialogOpen(true);
  };

  const handleDelete = (paciente: Paciente) => {
    setPacienteToDelete(paciente);
    setIsDeleteDialogOpen(true);
  };

  const handleNewPaciente = () => {
    setSelectedPaciente(null);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pacienteToDelete) {
      deleteMutation.mutate(pacienteToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Gerenciamento de Pacientes</h1>
            <p className="text-muted-foreground mt-2">
              Cadastre, edite e gerencie os pacientes da clínica
            </p>
          </div>
          <Button onClick={handleNewPaciente} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Paciente
          </Button>
        </div>

        <PacientesList
          pacientes={pacientes || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PacienteDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          paciente={selectedPaciente}
        />

        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          pacienteName={pacienteToDelete?.nome || ""}
          onConfirm={confirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default Pacientes;
