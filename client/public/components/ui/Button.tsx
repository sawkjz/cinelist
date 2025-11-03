import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export function Button({ variant='primary', ...props }: Props) {
  const style = variant === 'secondary' ? { background:'#e5e7eb', color:'#111827' } : { background:'#111827', color:'#fff' }
  return <button {...props} style={{ padding:'8px 12px', borderRadius:8, border:'none', ...style }} />
}
