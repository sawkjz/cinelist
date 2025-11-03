import { PropsWithChildren } from 'react'

export function Badge({ children }: PropsWithChildren) {
  return <span style={{ padding:'2px 8px', borderRadius:999, background:'#e5e7eb', fontSize:12 }}>{children}</span>
}
