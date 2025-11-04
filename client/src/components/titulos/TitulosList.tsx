import { Titulo } from '../../lib/api'

export default function TitulosList({ data, onEdit, onDelete }: {
  data: Titulo[]
  onEdit: (t: Titulo) => void
  onDelete: (t: Titulo) => void
}) {
  if (!data.length) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Nenhum título cadastrado.</p>
  }

  const statusLabel: Record<string, string> = {
    ASSISTINDO: '🟡 Assistindo',
    CONCLUIDO: '🟢 Concluído', 
    QUERO_VER: '🔵 Quero ver',
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '16px',
      marginTop: '20px'
    }}>
      {data.map(t => (
        <div key={t.id} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '16px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{t.nome}</h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#f0f0f0',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {statusLabel[t.status]}
            </span>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            📺 {t.plataforma}
          </div>
          
          {t.avaliacao != null && (
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>
              ⭐ {t.avaliacao}/10
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              onClick={() => onEdit(t)}
              style={{
                padding: '8px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Editar
            </button>
            <button 
              onClick={() => onDelete(t)}
              style={{
                padding: '8px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
