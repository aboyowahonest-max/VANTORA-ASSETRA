'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useApp, fmt } from '@/components/App'
export default function Admin() {
  const { profile, reload } = useApp(), router = useRouter()
  const [rows, setRows] = useState([]), [edit, setEdit] = useState({}), [note, setNote] = useState('')
  const load = async () => { const { data } = await supabase.from('profiles').select('*').order('created_at'); setRows(data || []) }
  useEffect(() => { if (profile && profile.is_admin !== true) router.replace('/dashboard'); else if (profile) load() }, [profile])
  if (!profile?.is_admin) return null
  async function save(r) {
    const v = Number(edit[r.id]); if (Number.isNaN(v) || v < 0) return setNote('Enter a balance of 0 or more.')
    const { error } = await supabase.from('profiles').update({ balance: v }).eq('id', r.id)
    setNote(error ? error.message : `Saved ${r.email}`); setEdit(e => ({ ...e, [r.id]: undefined })); load(); reload()
  }
  return (<div className="card">
    <h1 className="mb-1 font-display text-2xl text-gold">Admin control panel</h1>
    <p className="mb-4 text-sm text-white/50">Edits save to Supabase immediately. {note && <span className="text-amber">{note}</span>}</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead className="text-white/50"><tr><th className="py-2">Email</th><th>Role</th><th>Balance</th><th>Set balance</th><th /></tr></thead>
      <tbody>{rows.map(r => <tr key={r.id} className="border-t border-white/5 transition hover:bg-gold/5">
        <td className="py-2">{r.email}</td><td>{r.is_admin ? 'Admin' : 'User'}</td><td className="glow">{fmt(r.balance)}</td>
        <td><input className="input !w-36 !py-1" type="number" placeholder={String(r.balance)} value={edit[r.id] ?? ''} onChange={e => setEdit({ ...edit, [r.id]: e.target.value })} /></td>
        <td><button className="btn !py-1" disabled={edit[r.id] === undefined || edit[r.id] === ''} onClick={() => save(r)}>Save</button></td></tr>)}</tbody></table></div></div>)
}
