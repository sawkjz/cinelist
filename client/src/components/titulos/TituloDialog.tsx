import { useEffect, useState } from 'react'
import { api, Titulo } from '../../lib/api'

export default function TituloDialog({ open, value, onClose, onSaved }: {
  open: boolean
  value: Titulo | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Titulo>({ 
    nome: '', 
    plataforma: '', 
    status: 'QUERO_VER', 
    avaliacao: undefined 
  })

  useEffect(() => {
    if (value) {
      setForm(value)
    } else {
      setForm({ nome: '', plataforma: '', status: 'QUERO_VER', avaliacao: undefined })
    }
  }, [value])

  const save = async () => {
    try {
      if (value?.id) {
        await api.put(`/titulos/${value.id}`, form)
      } else {
        await api.post('/titulos', form)
      }
      onSaved()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar título')
    }
  }

  if (!open) return null

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
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            {value ? 'Editar título' : 'Novo título'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Nome *
            </label>
            <input
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Digite o nome do título"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Plataforma *
            </label>
            <input
              value={form.plataforma}
              onChange={e => setForm({...form, plataforma: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Ex: Netflix, HBO Max, Amazon Prime"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Status
            </label>
            <select
              value={form.status}
              onChange={e => setForm({...form, status: e.target.value as any})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="QUERO_VER">🔵 Quero ver</option>
              <option value="ASSISTINDO">🟡 Assistindo</option>
              <option value="CONCLUIDO">🟢 Concluído</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Avaliação (0-10)
            </label>
            <input
              type="number"
              min={0}
              max={10}
              value={form.avaliacao ?? ''}
              onChange={e => setForm({...form, avaliacao: e.target.value ? Number(e.target.value) : undefined})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="De 0 a 10"
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '20px',
            borderTop: '1px solid #eee',
            paddingTop: '20px'
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
              onClick={save}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {value ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
