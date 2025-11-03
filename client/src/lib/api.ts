import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export type StatusTitulo = 'ASSISTINDO' | 'CONCLUIDO' | 'QUERO_VER'

export interface Titulo {
  id?: number
  nome: string
  plataforma: string
  status: StatusTitulo
  avaliacao?: number
}
