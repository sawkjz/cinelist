import { Titulo } from '../../lib/api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function TitulosList({ data, onEdit, onDelete }: {
  data: Titulo[]
  onEdit: (t: Titulo) => void
  onDelete: (t: Titulo) => void
}) {
  if (!data.length) return <p>Nenhum título cadastrado.</p>

  const statusLabel: Record<string,string> = {
    ASSISTINDO: 'Assistindo',
    CONCLUIDO: 'Concluído',
    QUERO_VER: 'Quero ver',
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))'}}>
      {data.map(t => (
        <Card key={t.id}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>{t.nome}</strong>
            <Badge>{statusLabel[t.status]}</Badge>
          </div>
          <div style={{fontSize:12,opacity:.8,margin:'6px 0'}}>Plataforma: {t.plataforma}</div>
          {t.avaliacao != null && <div>⭐ {t.avaliacao}/10</div>}
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <Button onClick={() => onEdit(t)}>Editar</Button>
            <Button variant="secondary" onClick={() => onDelete(t)}>Excluir</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
