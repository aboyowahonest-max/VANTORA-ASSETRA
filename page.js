'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useApp, fmt } from '@/components/App'
const ASSETS = {
  'Real Estate': [
    { name: 'Marina Tower Unit 14B', entry: 500, y: 0.14, note: 'Waterfront residential share' },
    { name: 'Old Town Lofts', entry: 1000, y: 0.18, note: 'Mixed-use block, 12 units' },
    { name: 'Harbor Logistics Park', entry: 2500, y: 0.22, note: 'Warehouse complex' }],
  'Car Fleet': [
    { name: 'City Delivery Van', entry: 300, y: 0.35, note: 'Last-mile leasing' },
    { name: 'Executive Sedan Pool', entry: 800, y: 0.42, note: 'Chauffeur fleet lease' },
    { name: 'Electric Freight Truck', entry: 1500, y: 0.55, note: 'Regional haulage lease' }],
  'Shares': [
    { name: 'AUREX Energy', entry: 200, y: 0.25, base: 142.3, seed: 1 },
    { name: 'NOVA Biotech', entry: 400, y: 0.4, base: 87.9, seed: 2 },
    { name: 'KRONOS Semiconductors', entry: 600, y: 0.5, base: 301.15, seed: 3 }]
}
export default function Marketplace() {
  const { available, reload, now } = useApp()
  const [tab, setTab] = useState('Real Estate'), [sel, setSel] = useState(null), [amt, setAmt] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const price = a => (a.base * (1 + 0.03 * Math.sin(now / 2500 + a.seed) + 0.01 * Math.sin(now / 700 + a.seed * 3))).toFixed(2)
  function open(a) { setSel(a); setAmt(String(a.entry)); setErr('') }
  async function confirm() {
    setBusy(true); setErr('')
    const { error } = await supabase.rpc('allocate', { p_category: tab, p_name: sel.name, p_amount: Number(amt), p_yield: sel.y })
    setBusy(false)
    if (error) return setErr(error.message)
    setSel(null); reload()
  }
  return (<div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex gap-1 rounded-xl border border-gold/20 bg-forest/60 p-1">
        {Object.keys(ASSETS).map(t => <button key={t} onClick={() => setTab(t)} className={`relative z-10 rounded-lg px-4 py-2 text-sm transition ${tab === t ? 'text-abyss' : 'text-white/70 hover:text-gold'}`}>
          {tab === t && <motion.span layoutId="tab" className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-gold to-amber" />}{t}</button>)}
      </div>
      <div className="text-sm text-white/60">Available: <span className="glow">{fmt(available)}</span></div>
    </div>
    <AnimatePresence mode="wait"><motion.div key={tab} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid gap-4 md:grid-cols-3">
      {ASSETS[tab].map(a => <div key={a.name} className="card card-hover flex flex-col gap-3">
        <h3 className="font-display text-xl text-amber">{a.name}</h3>
        {a.note && <p className="text-sm text-white/50">{a.note}</p>}
        {tab === 'Shares' && <div className="glow text-2xl">${price(a)}</div>}
        <dl className="space-y-1 text-sm"><div className="flex justify-between"><dt className="text-white/50">Entry</dt><dd>{fmt(a.entry)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/50">{tab === 'Car Fleet' ? 'Daily yield' : 'Simulated yield'}</dt><dd className="text-mint">{a.y}% / day</dd></div>
          {tab === 'Real Estate' && <div className="flex justify-between"><dt className="text-white/50">Projected monthly</dt><dd className="text-mint">+{((Math.pow(1 + a.y / 100, 30) - 1) * 100).toFixed(2)}%</dd></div>}</dl>
        <button className="btn mt-auto" onClick={() => open(a)}>Allocate credits</button></div>)}
    </motion.div></AnimatePresence>
    <AnimatePresence>{sel && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-md" onClick={() => setSel(null)}>
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="card w-full max-w-sm space-y-4 shadow-neon" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-xl text-gold">{sel.name}</h3>
        <label className="block text-sm text-white/60">Amount (min {fmt(sel.entry)})<input className="input mt-1" type="number" min={sel.entry} value={amt} onChange={e => setAmt(e.target.value)} /></label>
        {err && <p className="text-sm text-amber">{err}</p>}
        <div className="flex gap-2"><button className="btn flex-1" disabled={busy || Number(amt) < sel.entry} onClick={confirm}>{busy ? 'Allocating…' : 'Confirm allocation'}</button>
          <button className="rounded-xl border border-white/20 px-4" onClick={() => setSel(null)}>Cancel</button></div>
      </motion.div></motion.div>}</AnimatePresence>
  </div>)
}
