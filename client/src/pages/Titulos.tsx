import { useEffect, useState } from 'react'
import { api, Titulo } from '../lib/api'
import TitulosList from '../components/titulos/TitulosList'
import TituloDialog from '../components/titulos/TituloDialog'
import DeleteDialog from '../components/titulos/DeleteDialog'
import { Button } from '../components/ui/Button'

export default function Titulos() {
  const [titulos, setTitulos] = useState<Titulo[]>([])
  const [editing, setEditing] = useState<Titulo | null>(null)
  const [deleting, setDeleting] = useState<Titulo | null>(null)
  const [openForm, setOpenForm] = useState(false)

  const load = async () => {
    const { data } = await api.get<Titulo[]>('/titulos')
    setTitulos(data)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="grid">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Títulos</h2>
        <Button onClick={() => { setEditing(null); setOpenForm(true) }}>Novo título</Button>
      </div>

      <TitulosList
        data={titulos}
        onEdit={(t) => { setEditing(t); setOpenForm(true) }}
        onDelete={(t) => setDeleting(t)}
      />

      {openForm && (
        <TituloDialog
          open={openForm}
          value={editing}
          onClose={() => setOpenForm(false)}
          onSaved={() => { setOpenForm(false); load() }}
        />
      )}

      {deleting && (
        <DeleteDialog
          value={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => { setDeleting(null); load() }}
        />
      )}
    </div>
  )}
