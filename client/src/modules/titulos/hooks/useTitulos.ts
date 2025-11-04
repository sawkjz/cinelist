import { useState, useEffect } from 'react';
import { titulosService } from '../services/titulosService';
import { Titulo, TituloFormData } from '../types';

export const useTitulos = () => {
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTitulos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await titulosService.getAll();
      setTitulos(data);
    } catch (err) {
      setError('Erro ao carregar títulos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTitulo = async (data: TituloFormData) => {
    try {
      const newTitulo = await titulosService.create(data);
      setTitulos([...titulos, newTitulo]);
      return newTitulo;
    } catch (err) {
      setError('Erro ao criar título');
      throw err;
    }
  };

  const updateTitulo = async (id: number, data: TituloFormData) => {
    try {
      const updatedTitulo = await titulosService.update(id, data);
      setTitulos(titulos.map(t => t.id === id ? updatedTitulo : t));
      return updatedTitulo;
    } catch (err) {
      setError('Erro ao atualizar título');
      throw err;
    }
  };

  const deleteTitulo = async (id: number) => {
    try {
      await titulosService.delete(id);
      setTitulos(titulos.filter(t => t.id !== id));
    } catch (err) {
      setError('Erro ao deletar título');
      throw err;
    }
  };

  useEffect(() => {
    fetchTitulos();
  }, []);

  return {
    titulos,
    loading,
    error,
    fetchTitulos,
    createTitulo,
    updateTitulo,
    deleteTitulo,
  };
};
