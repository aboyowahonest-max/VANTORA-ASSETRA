'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useApp, fmt } from '@/components/App'
export default function Dashboard() {
  const { total, available, invested, accrued, holdings } = useApp()
  const [hist, setHist] = useState([]), last = useRef(total); last.current = total
  useEffect(() => { const t = setInterval(() => setHist(h => [...h.slice(-59), last.current]), 1000); return () => clearInterval(t) }, [])
  const min = Math.min(...hist), max = Math.max(...hist), span = max - min || 1
  const pts = hist.map((v, i) => `${(i / 59) * 600},${110 - ((v - min) / span) * 100}`).join(' ')
  const cards = [['Total value', total, true], ['Available credits', available], ['Invested', invested], ['Yield earned', accrued, true]]
  return (<div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([l, v, g], i) => <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card card-hover">
        <div className="text-sm text-white/50">{l}</div><div className={`mt-2 text-2xl font-semibold ${g ? 'glow' : ''}`}>{fmt(v)}</div></motion.div>)}
    </div>
    <div className="card"><div className="mb-2 text-sm text-white/50">Live performance (1 minute = 1 simulated day)</div>
      <svg viewBox="0 0 600 120" className="h-40 w-full"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5CFFB0" stopOpacity=".35" /><stop offset="1" stopColor="#5CFFB0" stopOpacity="0" /></linearGradient></defs>
        {hist.length > 1 && <><polygon points={`0,120 ${pts} ${((hist.length - 1) / 59) * 600},120`} fill="url(#g)" /><polyline points={pts} fill="none" stroke="#5CFFB0" strokeWidth="2" /></>}</svg></div>
    <div className="card"><h2 className="mb-3 font-display text-xl text-gold">Your allocations</h2>
      {holdings.length === 0 ? <p className="text-white/60">No allocations yet. <Link href="/marketplace" className="text-gold">Browse the marketplace</Link> to put your credits to work.</p> :
        <div className="divide-y divide-white/5">{holdings.map(h => <div key={h.id} className="flex justify-between py-2 text-sm"><span>{h.name} <span className="text-white/40">{h.category}</span></span><span>{fmt(h.amount)} <span className="text-mint">+{h.daily_yield}%/day</span></span></div>)}</div>}</div>
  </div>)
}
