import { useState, useEffect } from 'react';
import { titulosService } from '../services/titulosService';
import { Titulo } from '../types';

interface TitulosListProps {
  onEdit: (titulo: Titulo) => void;
  refresh: number; // Para forçar atualização da lista
}

export function TitulosList({ onEdit, refresh }: TitulosListProps) {
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTitulos();
  }, [refresh]);

  const loadTitulos = async () => {
    try {
      setLoading(true);
      const data = await titulosService.getAll();
      setTitulos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar títulos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este título?')) return;

    try {
      await titulosService.delete(id);
      await loadTitulos();
    } catch (err) {
      alert('Erro ao excluir título');
      console.error(err);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="titulos-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {titulos.map((titulo) => (
            <tr key={titulo.id}>
              <td>{titulo.id}</td>
              <td>{titulo.descricao}</td>
              <td>R$ {titulo.valor.toFixed(2)}</td>
              <td>{new Date(titulo.vencimento).toLocaleDateString()}</td>
              <td>
                <span className={`status status-${titulo.status}`}>
                  {titulo.status}
                </span>
              </td>
              <td>
                <button onClick={() => onEdit(titulo)}>Editar</button>
                <button onClick={() => handleDelete(titulo.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
