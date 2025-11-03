import { useEffect, useState } from 'react'
import { api, Titulo } from '../../lib/api'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

export default function TituloDialog({ open, value, onClose, onSaved }: {
  open: boolean
  value: Titulo | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Titulo>({ nome: '', plataforma: '', status: 'QUERO_VER', avaliacao: undefined })

  useEffect(() => {
    if (value) setForm(value)
    else setForm({ nome: '', plataforma: '', status: 'QUERO_VER', avaliacao: undefined })
  }, [value])

  const save = async () => {
    if (value?.id) await api.put(`/titulos/${value.id}`, form)
    else await api.post('/titulos', form)
    onSaved()
  }

  return (
    <Dialog open={open} title={value ? 'Editar título' : 'Novo título'} onClose={onClose}>
      <div className="grid">
        <label>Nome<Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></label>
        <label>Plataforma<Input value={form.plataforma} onChange={e => setForm({...form, plataforma: e.target.value})} /></label>
        <label>Status
          <Select value={form.status} onChange={v => setForm({...form, status: v as any})}
            options={[
              { value: 'ASSISTINDO', label: 'Assistindo' },
              { value: 'CONCLUIDO', label: 'Concluído' },
              { value: 'QUERO_VER', label: 'Quero ver' }
            ]}
          />
        </label>
        <label>Avaliação (0-10)
          <Input type="number" min={0} max={10} value={form.avaliacao ?? ''} onChange={e => setForm({...form, avaliacao: e.target.value ? Number(e.target.value) : undefined})} />
        </label>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={save}>Salvar</Button>
        </div>
      </div>
    </Dialog>
  )
}
