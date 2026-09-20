with open("src/components/AdminDashboardView.tsx", "r") as f:
    content = f.read()

# 1. Import PaymentModal if not present
if "import { PaymentModal }" not in content:
    content = content.replace(
        "import { PharmacistCardModal } from './PharmacistCardModal';",
        "import { PharmacistCardModal } from './PharmacistCardModal';\nimport { PaymentModal } from './PaymentModal';"
    )

# 2. Update state inside AdminDashboardView
old_tx_state = """  // Transaction Filters & Data
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'TMONEY' | 'FLOOZ' | 'CARD'>('ALL');
  const transactionsData = [
    { id: 'TX-TMG-89124', client: 'Pharmacie Populaire Tokoin', type: 'Galenis Pro (Mensuel)', method: 'T-Money', amount: '5 000 FCFA', date: "Aujourd'hui à 11:32" },
    { id: 'TX-FLZ-78210', client: 'Pharmacie Agoè Assiyéyé', type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: "Aujourd'hui à 09:15" },
    { id: 'TX-TMG-67192', client: 'SADPlus (Ref: acc_2209219218)', type: 'Recharge Quota API (Pack 50k)', method: 'T-Money', amount: '25 000 FCFA', date: 'Hier à 16:40' },
    { id: 'TX-CRD-54018', client: 'SmartPharma Cloud', type: 'Galenis Enterprise', method: 'Carte Bancaire', amount: '25 000 FCFA', date: 'Hier à 14:10' },
    { id: 'TX-FLZ-43921', client: "Pharmacie de l'Aéroport", type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: '06/09/2026' },
    { id: 'TX-TMG-32810', client: 'Pharmacie Gbossimé', type: 'Galenis Pro (Trimestriel)', method: 'T-Money', amount: '14 250 FCFA', date: '05/09/2026' }
  ];"""

new_tx_state = """  // FedaPay Gateway Configuration & Test Modal State
  const [isFedapayConfigOpen, setIsFedapayConfigOpen] = useState(false);
  const [showAdminPaymentModal, setShowAdminPaymentModal] = useState(false);
  const [fedapayConfig, setFedapayConfig] = useState({
    merchantId: 'fed_acc_tg_91823',
    merchantName: 'Ordre National des Pharmaciens du Togo / Galenis',
    publicKeyLive: 'pk_live_tg_883019238120491',
    secretKeyLive: 'sk_live_tg_••••••••••••••••••••••••',
    publicKeySandbox: 'pk_sandbox_tg_test_992140',
    mode: 'LIVE' as 'LIVE' | 'SANDBOX',
    webhookUrl: 'https://api.galenis.tg/v1/fedapay/webhooks',
    webhookSecret: 'whsec_fp_99382104918239012',
    autoPayoutBank: 'Orabank Togo (Compte ONPT N° 0918204912)',
    payoutThreshold: 500000
  });

  // Transaction Filters & Data (reactive to FedaPay payments)
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'TMONEY' | 'FLOOZ' | 'CARD'>('ALL');
  
  const defaultTransactions = [
    { id: 'fp_tx_live_89124', operatorRef: 'TMG-89124', client: 'Pharmacie Populaire Tokoin', type: 'Galenis Pro (Mensuel)', method: 'T-Money', amount: '5 000 FCFA', date: "Aujourd'hui à 11:32", status: 'APPROVED' },
    { id: 'fp_tx_live_78210', operatorRef: 'FLZ-78210', client: 'Pharmacie Agoè Assiyéyé', type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: "Aujourd'hui à 09:15", status: 'APPROVED' },
    { id: 'fp_tx_live_67192', operatorRef: 'TMG-67192', client: 'SADPlus (Ref: acc_2209219218)', type: 'Recharge Quota API (Pack 50k)', method: 'T-Money', amount: '25 000 FCFA', date: 'Hier à 16:40', status: 'APPROVED' },
    { id: 'fp_tx_live_54018', operatorRef: 'GIM-54018', client: 'SmartPharma Cloud', type: 'Galenis Enterprise', method: 'Carte Bancaire', amount: '25 000 FCFA', date: 'Hier à 14:10', status: 'APPROVED' },
    { id: 'fp_tx_live_43921', operatorRef: 'FLZ-43921', client: "Pharmacie de l'Aéroport", type: 'Galenis Pro (Mensuel)', method: 'Moov Flooz', amount: '5 000 FCFA', date: '06/09/2026', status: 'APPROVED' },
    { id: 'fp_tx_live_32810', operatorRef: 'TMG-32810', client: 'Pharmacie Gbossimé', type: 'Galenis Pro (Trimestriel)', method: 'T-Money', amount: '14 250 FCFA', date: '05/09/2026', status: 'APPROVED' }
  ];

  const [transactionsData, setTransactionsData] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('galenis_fedapay_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...parsed, ...defaultTransactions];
      }
    } catch (e) {}
    return defaultTransactions;
  });

  useEffect(() => {
    const handleNewTx = () => {
      try {
        const stored = localStorage.getItem('galenis_fedapay_transactions');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTransactionsData([...parsed, ...defaultTransactions]);
        }
      } catch (err) {}
    };
    window.addEventListener('galenis_transaction_completed', handleNewTx);
    window.addEventListener('storage', handleNewTx);
    return () => {
      window.removeEventListener('galenis_transaction_completed', handleNewTx);
      window.removeEventListener('storage', handleNewTx);
    };
  }, []);"""

content = content.replace(old_tx_state, new_tx_state)

# 3. Replace the Balances Section to explicitly feature FedaPay
old_balances_header = """          {/* SECTION: BALANCES & PASSERELLES MOBILES TOGO (T-MONEY & FLOOZ) */}
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
            </div>"""

new_balances_header = """          {/* SECTION: BALANCES & PASSERELLE AGRÉGÉE FEDAPAY TOGO */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    F
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Agrégateur de Paiement FedaPay Togo (T-Money, Flooz & Cartes)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                    Agréé FedaPay UEMOA
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Passerelle de collecte nationale unifiée via FedaPay : T-Money (Togocom), Moov Flooz et Cartes GIM/Visa.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsFedapayConfigOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Paramètres FedaPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminPaymentModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tester Paiement FedaPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Virement Payout FedaPay initié avec succès vers le compte bancaire Orabank Togo de l'Ordre National des Pharmaciens (Réf: VIR-FEDAPAY-TG-2026-9812 - Montant: 1 600 000 FCFA).");
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Décaisser vers Orabank</span>
                </button>
              </div>
            </div>"""

content = content.replace(old_balances_header, new_balances_header)

# 4. In transactions table, update headers to show Réf. FedaPay and Opérateur
content = content.replace(
    '<th className="py-2.5 px-4">Réf. Transaction</th>',
    '<th className="py-2.5 px-4">Réf. FedaPay</th>\n                    <th className="py-2.5 px-4">Réf. Opérateur</th>'
)

# And in row rendering:
old_tx_row = """                        <td className="py-3 px-4 font-mono font-bold text-slate-700 text-[11px]">
                          {tx.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tx.client}
                        </td>"""

new_tx_row = """                        <td className="py-3 px-4 font-mono font-bold text-slate-700 text-[11px]">
                          <span className="text-emerald-700 font-black">{tx.id}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {tx.operatorRef || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tx.client}
                        </td>"""

content = content.replace(old_tx_row, new_tx_row)

# 5. Add FedaPay Configuration Modal before the closing tags of AdminDashboardView
modal_code = """
      {/* MODAL CONFIGURATION FEDAPAY */}
      {isFedapayConfigOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setIsFedapayConfigOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Passerelle FedaPay Togo</span>
              </div>
              <h3 className="text-lg font-black text-white">Paramétrage Agrégateur FedaPay</h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Configuration des clés d'API FedaPay (Live & Sandbox), Webhooks et Payouts bancaires.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              {/* Account info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Compte FedaPay Marchand</span>
                  <span className="font-bold text-slate-900">{fedapayConfig.merchantName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">ID Compte FedaPay</span>
                  <span className="font-mono font-bold text-emerald-800">{fedapayConfig.merchantId}</span>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div>
                  <span className="font-bold text-slate-900 block">Environnement Actif FedaPay</span>
                  <span className="text-[11px] text-slate-500">Basculez entre le mode Sandbox (Test) et Production (Live).</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFedapayConfig({ ...fedapayConfig, mode: 'SANDBOX' })}
                    className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                      fedapayConfig.mode === 'SANDBOX' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setFedapayConfig({ ...fedapayConfig, mode: 'LIVE' })}
                    className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                      fedapayConfig.mode === 'LIVE' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live (Prod)
                  </button>
                </div>
              </div>

              {/* API Keys */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clé Publique FedaPay (Public Key)</label>
                  <input
                    type="text"
                    readOnly
                    value={fedapayConfig.mode === 'LIVE' ? fedapayConfig.publicKeyLive : fedapayConfig.publicKeySandbox}
                    className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clé Secrète FedaPay (Secret Key)</label>
                  <input
                    type="text"
                    readOnly
                    value={fedapayConfig.secretKeyLive}
                    className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 font-bold"
                  />
                </div>
              </div>

              {/* Webhook */}
              <div className="space-y-1.5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900">URL Webhook Écouteur Galenis</span>
                  <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Actif 200 OK</span>
                </div>
                <code className="block font-mono text-[11px] text-emerald-800 bg-white p-2 rounded-lg border border-emerald-200 break-all font-bold">
                  {fedapayConfig.webhookUrl}
                </code>
                <p className="text-[10px] text-emerald-800 font-medium">
                  Événements écoutés : <code className="font-bold">transaction.created</code>, <code className="font-bold">transaction.approved</code>, <code className="font-bold">payout.success</code>.
                </p>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFedapayConfigOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFedapayConfigOpen(false);
                    setToastMessage("Paramètres FedaPay enregistrés avec succès.");
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                >
                  Enregistrer les Clés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TEST PAYMENT MODAL */}
      <PaymentModal
        isOpen={showAdminPaymentModal}
        onClose={() => setShowAdminPaymentModal(false)}
        onSuccess={() => {
          setShowAdminPaymentModal(false);
          setToastMessage("Paiement FedaPay de test validé avec succès !");
        }}
        planName="Galenis Pro Test (Mensuel)"
        amountFcfa={5000}
        clientName="Pharmacie Populaire Tokoin"
        clientEmail="contact@pharmacietokoin.tg"
      />
"""

# Insert modal before the final return closing tag
target_end = "      {/* Toast Notification */}"
if target_end in content:
    content = content.replace(target_end, modal_code + "\n      {/* Toast Notification */}")
else:
    content = content.replace("    </div>\n  );", modal_code + "\n    </div>\n  );")

with open("src/components/AdminDashboardView.tsx", "w") as f:
    f.write(content)

print("AdminDashboardView patched with FedaPay successfully!")
