with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

import_recharts = """
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
"""
if "recharts" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\n" + import_recharts)

revenue_content = """
      {/* 8. REVENUS & ABONNEMENTS */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Revenus & Abonnements</h2>
              <p className="text-sm text-slate-500 font-medium">Suivi financier des souscriptions Galenis Pro et Enterprise</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs">
                <Download className="w-4 h-4" />
                <span>Exporter le rapport</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>MRR (Revenu Mensuel Récurrent)</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">1,250,000 FCFA</div>
              <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% ce mois</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Abonnements Actifs</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">184</div>
              <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+8 nouvelles officines</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                <Banknote className="w-4 h-4 text-amber-600" />
                <span>En attente de paiement</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">125,000 FCFA</div>
              <div className="text-xs text-amber-600 font-bold mt-1 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                <span>5 factures échues</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-6">Évolution des Revenus (6 derniers mois)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Mars', revenue: 850000 },
                    { month: 'Avril', revenue: 920000 },
                    { month: 'Mai', revenue: 1050000 },
                    { month: 'Juin', revenue: 1100000 },
                    { month: 'Juillet', revenue: 1180000 },
                    { month: 'Août', revenue: 1250000 }
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenu']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Prochaines Échéances</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-md">7 jours</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {[
                  { name: 'Pharmacie Populaire Tokoin', plan: 'Galenis Pro', date: 'Demain', amount: '5 000 FCFA' },
                  { name: 'Pharmacie Agoè Assiyéyé', plan: 'Galenis Pro', date: 'Dans 2 jours', amount: '5 000 FCFA' },
                  { name: 'Pharmacie de l\'Aéroport', plan: 'Galenis Pro', date: 'Dans 3 jours', amount: '5 000 FCFA' },
                  { name: 'SmartPharma Cloud', plan: 'Enterprise', date: 'Dans 5 jours', amount: '25 000 FCFA' },
                  { name: 'Pharmacie Gbossimé', plan: 'Galenis Pro', date: 'Dans 6 jours', amount: '5 000 FCFA' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.plan} • Échéance : {item.date}</div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-700">{item.amount}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer">
                Voir toutes les échéances
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("{/* Modal: Diffuser Alerte Flash DPML */}", revenue_content + "\n      {/* Modal: Diffuser Alerte Flash DPML */}")

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)
