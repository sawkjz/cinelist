import { api, Titulo } from '../../lib/api'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'

export default function DeleteDialog({ value, onClose, onDeleted }: {
  value: Titulo
  onClose: () => void
  onDeleted: () => void
}) {
  const del = async () => {
    await api.delete(`/titulos/${value.id}`)
    onDeleted()
  }
  return (
    <Dialog open={true} title="Excluir título" onClose={onClose}>
      <p>Tem certeza que deseja excluir "{value.nome}"?</p>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={del}>Excluir</Button>
      </div>
    </Dialog>
  )
}
