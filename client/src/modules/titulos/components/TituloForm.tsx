import { useState, useEffect } from 'react';
import { titulosService } from '../services/titulosService';
import { Titulo, TituloFormData } from '../types';

interface TituloFormProps {
  tituloToEdit?: Titulo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TituloForm({ tituloToEdit, onSuccess, onCancel }: TituloFormProps) {
  const [formData, setFormData] = useState<TituloFormData>({
    descricao: '',
    valor: 0,
    vencimento: '',
    status: 'pendente',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tituloToEdit) {
      setFormData({
        descricao: tituloToEdit.descricao,
        valor: tituloToEdit.valor,
        vencimento: tituloToEdit.vencimento.split('T')[0],
        status: tituloToEdit.status,
      });
    }
  }, [tituloToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tituloToEdit) {
        await titulosService.update(tituloToEdit.id, formData);
      } else {
        await titulosService.create(formData);
      }
      onSuccess();
      resetForm();
    } catch (err) {
      alert('Erro ao salvar título');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: 0,
      vencimento: '',
      status: 'pendente',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="titulo-form">
      <h2>{tituloToEdit ? 'Editar Título' : 'Novo Título'}</h2>

      <div className="form-group">
        <label>Descrição:</label>
        <input
          type="text"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Valor:</label>
        <input
          type="number"
          step="0.01"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div className="form-group">
        <label>Vencimento:</label>
        <input
          type="date"
          value={formData.vencimento}
          onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Status:</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="atrasado">Atrasado</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
