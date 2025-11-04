import { api, Titulo } from '../../lib/api'

export default function DeleteDialog({ value, onClose, onDeleted }: {
  value: Titulo
  onClose: () => void
  onDeleted: () => void
}) {
  const del = async () => {
    try {
      await api.delete(`/titulos/${value.id}`)
      onDeleted()
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir título')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        minWidth: '350px',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#dc3545' }}>
            ⚠️ Confirmar exclusão
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          Tem certeza que deseja excluir <strong>"{value.nome}"</strong>?
        </p>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Esta ação não pode ser desfeita.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={del}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
