export function Select({ value, onChange, options }:{ value?: string, onChange: (v:string)=>void, options: { value: string, label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width:'100%', padding:8, borderRadius:8, border:'1px solid #e5e7eb' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
