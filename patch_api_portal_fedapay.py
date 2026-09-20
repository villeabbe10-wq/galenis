with open("src/components/ApiPortal/ApiPortalView.tsx", "r") as f:
    content = f.read()

# 1. Import PaymentModal
if "import { PaymentModal }" not in content:
    content = content.replace(
        "import { DeveloperOnboardingWizard } from '../DeveloperOnboardingWizard';",
        "import { DeveloperOnboardingWizard } from '../DeveloperOnboardingWizard';\nimport { PaymentModal } from '../PaymentModal';"
    )

# 2. Add state for FedaPay recharge modal
state_anchor = "  const [activeTab, setActiveTab] = useState<ApiPortalTab>('OVERVIEW');"
state_code = """  const [activeTab, setActiveTab] = useState<ApiPortalTab>('OVERVIEW');
  const [showFedapayRechargeModal, setShowFedapayRechargeModal] = useState(false);
  const [rechargePack, setRechargePack] = useState({ name: 'Recharge Quota API (Pack 10 000 requêtes)', amount: 5000 });"""
content = content.replace(state_anchor, state_code)

# 3. Add FedaPay recharge card in KEYS tab
quota_bar_anchor = """                      {/* Bar Visualization */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-slate-700">Consommation globale quotidienne</span>
                          <span className="text-emerald-800">{displayUsed.toLocaleString()} / {limit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
                          <div className="bg-[#009A63] h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(4, percentage)}%` }} />
                        </div>
                      </div>"""

recharge_card = """                      {/* Bar Visualization */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-slate-700">Consommation globale quotidienne</span>
                          <span className="text-emerald-800">{displayUsed.toLocaleString()} / {limit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
                          <div className="bg-[#009A63] h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(4, percentage)}%` }} />
                        </div>
                      </div>

                      {/* Recharge Rapide via Passerelle FedaPay */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                              Recharge Immédiate via Passerelle FedaPay Togo
                            </h4>
                            <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                              T-Money • Flooz • Cartes
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            Besoin de plus de requêtes ? Créditez votre compte instantanément sans rupture de service.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setRechargePack({ name: 'Recharge Quota API (Pack 10 000 requêtes)', amount: 5000 });
                              setShowFedapayRechargeModal(true);
                            }}
                            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-black text-xs transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>+10k req (5 000 FCFA)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRechargePack({ name: 'Recharge Quota API (Pack 50 000 requêtes)', amount: 25000 });
                              setShowFedapayRechargeModal(true);
                            }}
                            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>+50k req (25 000 FCFA)</span>
                          </button>
                        </div>
                      </div>"""

content = content.replace(quota_bar_anchor, recharge_card)

# 4. Insert PaymentModal inside ApiPortalView before the closing tag
modal_jsx = """
      {/* MODAL PAIEMENT & RECHARGE FEDAPAY */}
      <PaymentModal
        isOpen={showFedapayRechargeModal}
        onClose={() => setShowFedapayRechargeModal(false)}
        onSuccess={() => {
          setShowFedapayRechargeModal(false);
          alert("Recharge FedaPay validée ! Vos quotas ont été immédiatement rehaussés sur le serveur Galenis.");
        }}
        planName={rechargePack.name}
        amountFcfa={rechargePack.amount}
        clientName="SADPlus (Ref: acc_2209219218)"
        clientEmail="contact@sadplus.tg"
      />
"""

content = content.replace(
    "    </div>\n  );\n};",
    modal_jsx + "\n    </div>\n  );\n};"
)

with open("src/components/ApiPortal/ApiPortalView.tsx", "w") as f:
    f.write(content)

print("ApiPortalView patched with FedaPay successfully!")
