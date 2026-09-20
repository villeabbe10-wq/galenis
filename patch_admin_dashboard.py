with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

# 1. Update imports to include ShoppingBag, Smartphone, CreditCard, ArrowUpRight
content = content.replace(
    "  BarChart3, CalendarDays, Wallet, Banknote,",
    "  BarChart3, CalendarDays, Wallet, Banknote, ShoppingBag, Smartphone, CreditCard, ArrowUpRight,"
)

# 2. Add state inside AdminDashboardView component
admin_state_code = '''
  // Developer Account Validation State (synced with ApiPortal)
  const [devAccountAdmin, setDevAccountAdmin] = useState<{
    name: string;
    ref: string;
    isValidated: boolean;
    tier: string;
    email: string;
    dailyLimit: number;
    requestPending: boolean;
  }>(() => {
    try {
      const stored = localStorage.getItem('galenis_dev_account');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      name: 'SADPlus',
      ref: 'acc_2209219218',
      isValidated: false,
      tier: 'Sandbox (Test)',
      email: 'contact@sadplus.tg',
      dailyLimit: 1000,
      requestPending: false
    };
  });

  useEffect(() => {
    const handleAccountSync = () => {
      try {
        const stored = localStorage.getItem('galenis_dev_account');
        if (stored) {
          setDevAccountAdmin(JSON.parse(stored));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleAccountSync);
    window.addEventListener('galenis_dev_account_updated', handleAccountSync);
    return () => {
      window.removeEventListener('storage', handleAccountSync);
      window.removeEventListener('galenis_dev_account_updated', handleAccountSync);
    };
  }, []);

  const handleToggleDevValidation = () => {
    const newStatus = !devAccountAdmin.isValidated;
    const updated = {
      ...devAccountAdmin,
      isValidated: newStatus,
      tier: newStatus ? 'Certifié DPML (Production)' : 'Sandbox (Test)',
      dailyLimit: newStatus ? 100000 : 1000,
      requestPending: false
    };
    setDevAccountAdmin(updated);
    localStorage.setItem('galenis_dev_account', JSON.stringify(updated));
    window.dispatchEvent(new Event('galenis_dev_account_updated'));
    setToastMessage(newStatus 
      ? "Compte SADPlus (Ref: acc_2209219218) validé avec succès pour la Production (100k req/j) !"
      : "Compte SADPlus rétrogradé en mode Sandbox (Test)."
    );
  };

  // Transaction Filters & Data
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'TMONEY' | 'FLOOZ' | 'CARD'>('ALL');
  const transactionsData = [
    { id: 'TX-TMG-89124', client: 'Pharmacie Populaire Tokoin', type: 'Galenis Pro (Mensuel)', method: 'T-Money', amount: '5 000 FCFA', date: "Aujourd'hui à 11:32" },
    { id: 'TX-FLZ-78210', client: 'Pharmacie Agoè Assiyéyé', type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: "Aujourd'hui à 09:15" },
    { id: 'TX-TMG-67192', client: 'SADPlus (Ref: acc_2209219218)', type: 'Recharge Quota API (Pack 50k)', method: 'T-Money', amount: '25 000 FCFA', date: 'Hier à 16:40' },
    { id: 'TX-CRD-54018', client: 'SmartPharma Cloud', type: 'Galenis Enterprise', method: 'Carte Bancaire', amount: '25 000 FCFA', date: 'Hier à 14:10' },
    { id: 'TX-FLZ-43921', client: "Pharmacie de l'Aéroport", type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: '06/09/2026' },
    { id: 'TX-TMG-32810', client: 'Pharmacie Gbossimé', type: 'Galenis Pro (Trimestriel)', method: 'T-Money', amount: '14 250 FCFA', date: '05/09/2026' }
  ];
'''

content = content.replace(
    "  const [toastMessage, setToastMessage] = useState('');",
    "  const [toastMessage, setToastMessage] = useState('');\n" + admin_state_code
)

# 3. Add the sections inside activeTab === 'revenue' right after upcoming renewals
target = """              <button className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer">
                Voir toutes les échéances
              </button>
            </div>
          </div>"""

revenue_additions = """
          {/* SECTION: BALANCES & PASSERELLES MOBILES TOGO (T-MONEY & FLOOZ) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Balances & Passerelles Mobiles Togo</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Soldes collectés en temps réel via les agrégateurs nationaux Togocom (T-Money) et Moov Africa (Flooz).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("Virement de décaissement initié avec succès vers le compte bancaire Orabank Togo de l'Ordre National des Pharmaciens (Réf: VIR-TG-2026-9812).");
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Décaisser vers Compte Bancaire</span>
                </button>
              </div>
            </div>

            {/* Balances Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* T-Money */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009A63]" />
                    T-Money (Togocom)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">Actif</span>
                </div>
                <div className="text-2xl font-black text-slate-900">780 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60 font-medium">
                  <span>84 transactions réussies</span>
                  <span className="font-bold text-emerald-700">Frais 1.2%</span>
                </div>
              </div>

              {/* Moov Flooz */}
              <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-blue-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Moov Money Flooz
                  </span>
                  <span className="text-[10px] font-bold bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">Actif</span>
                </div>
                <div className="text-2xl font-black text-slate-900">470 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-blue-200/60 font-medium">
                  <span>48 transactions réussies</span>
                  <span className="font-bold text-blue-700">Frais 1.2%</span>
                </div>
              </div>

              {/* Cartes & Total */}
              <div className="p-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/70 to-fuchsia-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-purple-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-700" />
                    Cartes GIM-UEMOA / Visa
                  </span>
                  <span className="text-[10px] font-bold bg-purple-200/70 text-purple-800 px-2 py-0.5 rounded-full">En ligne</span>
                </div>
                <div className="text-2xl font-black text-slate-900">350 000 FCFA</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-purple-200/60 font-medium">
                  <span>16 transactions</span>
                  <span className="font-bold text-purple-700">Sécurisé 3D-S</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: TRANSACTIONS & RÈGLEMENTS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-700" />
                  <span>Dernières Transactions & Règlements Encaissés</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Historique des souscriptions et recharges API Galenis Pro & Développeurs</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'Tous' },
                  { id: 'TMONEY', label: 'T-Money' },
                  { id: 'FLOOZ', label: 'Flooz' },
                  { id: 'CARD', label: 'Carte Bancaire' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTransactionFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      transactionFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Réf. Transaction</th>
                    <th className="py-2.5 px-4">Client / Organisation</th>
                    <th className="py-2.5 px-4">Motif</th>
                    <th className="py-2.5 px-4">Moyen</th>
                    <th className="py-2.5 px-4">Montant</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactionsData
                    .filter(tx => {
                      if (transactionFilter === 'TMONEY') return tx.method === 'T-Money';
                      if (transactionFilter === 'FLOOZ') return tx.method === 'Moov Flooz';
                      if (transactionFilter === 'CARD') return tx.method === 'Carte Bancaire';
                      return true;
                    })
                    .map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 text-[11px]">
                          {tx.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tx.client}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tx.type}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            tx.method === 'T-Money' ? 'bg-emerald-100 text-emerald-800' :
                            tx.method === 'Moov Flooz' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          {tx.amount}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Validé</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION: VALIDATION DES COMPTES DÉVELOPPEURS & ACCRÉDITATIONS API */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Agréments Développeurs & Validation des Comptes API
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Gouvernance des accès tiers, passage de Sandbox (Test) vers Production Certifiée DPML.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Supervision Ordre National des Pharmaciens
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Projet / Entité</th>
                    <th className="py-2.5 px-4">Référence Unique</th>
                    <th className="py-2.5 px-4">Contact</th>
                    <th className="py-2.5 px-4">Statut Actuel</th>
                    <th className="py-2.5 px-4">Plafond Req/j</th>
                    <th className="py-2.5 px-4 text-right">Action Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* The dynamic developer account synced with ApiPortal */}
                  <tr className="hover:bg-purple-50/40 bg-purple-50/15 transition-colors">
                    <td className="py-3 px-4 font-bold text-purple-950 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span>{devAccountAdmin.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">
                      {devAccountAdmin.ref}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {devAccountAdmin.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] ${
                        devAccountAdmin.isValidated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${devAccountAdmin.isValidated ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <span>{devAccountAdmin.isValidated ? 'Validé (Production)' : 'Non Validé (Sandbox)'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                      {devAccountAdmin.isValidated ? '100 000 / j' : '1 000 / j'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={handleToggleDevValidation}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                          devAccountAdmin.isValidated
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {devAccountAdmin.isValidated ? 'Rétrograder en Sandbox' : "Valider l'Accès Production"}
                      </button>
                    </td>
                  </tr>

                  {/* Other verified partners */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        CB
                      </div>
                      <span>Clinique Biasa SI</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      acc_19482031
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      dsi@cliniquebiasa.tg
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Validé (Production)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                      100 000 / j
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-slate-400 font-bold">Agréé DPML</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        SP
                      </div>
                      <span>SmartPharma Togo</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      acc_88301923
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      api@smartpharma.tg
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Validé (Production)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                      100 000 / j
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-slate-400 font-bold">Agréé DPML</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
"""

content = content.replace(target, target + "\n" + revenue_additions)

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)

print("AdminDashboardView patched successfully!")
