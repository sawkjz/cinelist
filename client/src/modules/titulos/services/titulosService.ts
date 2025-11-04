import api from '../../../services/api';
import { Titulo, TituloFormData } from '../types';

export const titulosService = {
  getAll: async (): Promise<Titulo[]> => {
    const response = await api.get<Titulo[]>('/titulos');
    return response.data;
  },

  getById: async (id: number): Promise<Titulo> => {
    const response = await api.get<Titulo>(`/titulos/${id}`);
    return response.data;
  },

  create: async (data: TituloFormData): Promise<Titulo> => {
    const response = await api.post<Titulo>('/titulos', data);
    return response.data;
  },

  update: async (id: number, data: TituloFormData): Promise<Titulo> => {
    const response = await api.put<Titulo>(`/titulos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/titulos/${id}`);
  },
};
