import { PropsWithChildren } from 'react'

export function Card({ children }: PropsWithChildren) {
  return <div style={{ border:'1px solid #e5e7eb', borderRadius:12, padding:12 }}>{children}</div>
}
