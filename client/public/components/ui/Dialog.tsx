import { PropsWithChildren } from 'react'

export function Dialog({ open, title, onClose, children }: PropsWithChildren<{ open: boolean, title: string, onClose: () => void }>) {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'grid', placeItems:'center' }} onClick={onClose}>
      <div style={{ background:'#fff', color:'#111', minWidth:360, maxWidth:600, padding:16, borderRadius:12 }} onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <strong>{title}</strong>
          <button onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
