import re

with open("src/components/ApiPortal/ApiPortalView.tsx", "r") as f:
    content = f.read()

# 1. Update React import to include useEffect
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

# 2. Insert developer account, logs, and events state right above "// Interactive REST Tester State"
state_code = '''
  // Developer Account State (Synced with Admin via localStorage & events)
  const [developerAccount, setDeveloperAccount] = useState<{
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

  // Sync with Admin validation events
  useEffect(() => {
    const handleAccountSync = () => {
      try {
        const stored = localStorage.getItem('galenis_dev_account');
        if (stored) {
          setDeveloperAccount(JSON.parse(stored));
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

  const handleRequestValidation = () => {
    const updated = {
      ...developerAccount,
      requestPending: true
    };
    setDeveloperAccount(updated);
    localStorage.setItem('galenis_dev_account', JSON.stringify(updated));
    window.dispatchEvent(new Event('galenis_dev_account_updated'));
    alert("Demande de validation officielle envoyée au Comité Admin Galenis Togo !");
  };

  const handleToggleValidationQuick = () => {
    const updated = {
      ...developerAccount,
      isValidated: !developerAccount.isValidated,
      tier: !developerAccount.isValidated ? 'Certifié DPML (Production)' : 'Sandbox (Test)',
      dailyLimit: !developerAccount.isValidated ? 100000 : 1000,
      requestPending: false
    };
    setDeveloperAccount(updated);
    localStorage.setItem('galenis_dev_account', JSON.stringify(updated));
    window.dispatchEvent(new Event('galenis_dev_account_updated'));
  };

  // API Request Logs State
  const [apiLogs, setApiLogs] = useState<Array<{
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    status: number;
    statusText: string;
    latencyMs: number;
    timestamp: string;
    ip: string;
    keyId: string;
    userAgent: string;
    requestBody?: string;
    responsePayload?: any;
  }>>([
    {
      id: 'req_live_9941a82',
      method: 'GET',
      path: '/api/v1/gardes?city=Lome&guardOnly=true',
      status: 200,
      statusText: 'OK',
      latencyMs: 38,
      timestamp: 'Il y a 2 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: {
        status: 'success',
        count: 42,
        city: 'Lomé',
        data: [{ id: 'pharma-1', name: 'Pharmacie Populaire Tokoin', isGuard: true }]
      }
    },
    {
      id: 'req_live_8831c94',
      method: 'GET',
      path: '/api/v1/pharmacies?limit=10',
      status: 200,
      statusText: 'OK',
      latencyMs: 44,
      timestamp: 'Il y a 5 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { status: 'success', page: 1, total: 210 }
    },
    {
      id: 'req_live_7720d12',
      method: 'POST',
      path: '/api/v1/reports',
      status: 201,
      statusText: 'Created',
      latencyMs: 76,
      timestamp: 'Il y a 14 min',
      ip: '41.207.162.14 (Moov Togo)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-Backend/1.0',
      requestBody: '{\\n  "pharmacy_id": "pharma-12",\\n  "issue": "Ajustement garde"\\n}',
      responsePayload: { status: 'success', ticket_id: 'TG-REP-9102' }
    },
    {
      id: 'req_live_6619e05',
      method: 'GET',
      path: '/api/v1/disponibilites?drug=Insuline',
      status: 200,
      statusText: 'OK',
      latencyMs: 51,
      timestamp: 'Il y a 22 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { drug: 'Insuline Mixtard', inStock: 3, pharmacies_count: 2 }
    },
    {
      id: 'req_live_5508f33',
      method: 'GET',
      path: '/api/v1/gardes?city=Kara',
      status: 429,
      statusText: 'Too Many Requests',
      latencyMs: 14,
      timestamp: 'Il y a 38 min',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { error: 'Rate limit exceeded', limit: 1000, retry_after: 86400 }
    },
    {
      id: 'req_live_4497a11',
      method: 'GET',
      path: '/api/v1/pharmacies/non_existent_id',
      status: 404,
      statusText: 'Not Found',
      latencyMs: 22,
      timestamp: 'Il y a 1 heure',
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: { error: 'Pharmacy not found', code: 'PHARMA_NOT_FOUND' }
    }
  ]);

  const [logFilter, setLogFilter] = useState<'ALL' | '200' | '429' | 'ERRORS'>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);

  const handleSimulateApiCall = () => {
    const endpoints = [
      { path: '/api/v1/gardes?city=Lome', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/pharmacies?city=Sokode', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/disponibilites?drug=Paracetamol', method: 'GET' as const, status: 200, text: 'OK' },
      { path: '/api/v1/reports', method: 'POST' as const, status: 201, text: 'Created' },
      { path: '/api/v1/gardes?city=Kpalime', method: 'GET' as const, status: Math.random() > 0.8 ? 429 : 200, text: 'OK' }
    ];
    const picked = endpoints[Math.floor(Math.random() * endpoints.length)];
    const newLog = {
      id: `req_live_${Math.random().toString(36).substring(2, 9)}`,
      method: picked.method,
      path: picked.path,
      status: picked.status,
      statusText: picked.text,
      latencyMs: Math.floor(18 + Math.random() * 65),
      timestamp: "À l'instant",
      ip: '102.164.21.90 (Togo Telecom)',
      keyId: 'pdt_live_...3210',
      userAgent: 'SADPlus-App/2.4 (Android; TG)',
      responsePayload: {
        status: 'success',
        timestamp: new Date().toISOString(),
        queried_endpoint: picked.path
      }
    };
    setApiLogs(prev => [newLog, ...prev]);
  };

  // System Events Stream State
  const [systemEvents, setSystemEvents] = useState<Array<{
    id: string;
    event: string;
    category: 'GUARD' | 'STOCK' | 'SYSTEM' | 'SECURITY';
    summary: string;
    timestamp: string;
    source: string;
    payload: any;
  }>>([
    {
      id: 'evt_tg_9921',
      event: 'pharmacy.guard_turnover',
      category: 'GUARD',
      summary: 'Changement de garde effectif pour 42 officines de Lomé',
      timestamp: "Aujourd'hui à 20h00",
      source: 'Comité de Garde DPML',
      payload: { city: 'Lomé', active_guards: 42, period: 'Nuit & Weekend', published_by: 'ONPT' }
    },
    {
      id: 'evt_tg_9920',
      event: 'stock.critical_alert',
      category: 'STOCK',
      summary: 'Alerte stock critique : Insuline Mixtard 100UI (Rupture signalée Tokoin)',
      timestamp: 'Il y a 18 min',
      source: 'Pharmacie Populaire Tokoin',
      payload: { drug_id: 'med-insuline-100', current_stock: 2, status: 'CRITICAL', tension: 'Nationale' }
    },
    {
      id: 'evt_tg_9919',
      event: 'api.quota_warning_80',
      category: 'SYSTEM',
      summary: "Seuil d'alerte de quota 80% atteint pour la clé pdt_live_...3210",
      timestamp: 'Il y a 45 min',
      source: 'Galenis Gateway',
      payload: { key: 'pdt_live_free_...3210', used: 870, limit: 1000, percentage: 87 }
    },
    {
      id: 'evt_tg_9918',
      event: 'webhook.delivery_success',
      category: 'SYSTEM',
      summary: 'Webhook délivré avec succès à https://api.sadplus.tg/webhooks (HTTP 200)',
      timestamp: 'Il y a 1 heure',
      source: 'Galenis Webhook Dispatcher',
      payload: { target_url: 'https://api.sadplus.tg/webhooks', http_code: 200, latency_ms: 42 }
    },
    {
      id: 'evt_tg_9917',
      event: 'security.key_rotation',
      category: 'SECURITY',
      summary: 'Rotation automatique de certificat TLS & Signature HMAC SHA-256',
      timestamp: 'Ce matin à 06h00',
      source: 'Galenis Vault',
      payload: { certificate_valid_until: '2027-09-08', algorithm: 'HMAC-SHA256' }
    }
  ]);

  const [eventCategoryFilter, setEventCategoryFilter] = useState<'ALL' | 'GUARD' | 'STOCK' | 'SYSTEM' | 'SECURITY'>('ALL');

  const handleTriggerTestEvent = () => {
    const testEvt = {
      id: `evt_tg_${Math.floor(1000 + Math.random() * 9000)}`,
      event: 'pharmacy.guard_ping',
      category: 'GUARD' as const,
      summary: 'Test de synchronisation de garde en direct (Lomé Centre)',
      timestamp: "À l'instant",
      source: 'Simulateur Événement Dev',
      payload: { ping: true, time: new Date().toLocaleTimeString(), status: 'TEST_DELIVERED' }
    };
    setSystemEvents(prev => [testEvt, ...prev]);
  };
'''

content = content.replace(
    "  // Interactive REST Tester State",
    state_code + "\n  // Interactive REST Tester State"
)

# 3. Insert Developer Account Card at top of sidebar (above Section 1: GUIDE & ACCUEIL)
sidebar_dev_header = '''
          {/* Developer Account Badge - Inspired by SADPlus & Ref: acc_... */}
          <div className="p-3.5 bg-gradient-to-br from-purple-50/90 to-indigo-50/70 border border-purple-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-xs text-purple-950 flex items-center gap-1">
                    <span>{developerAccount.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-700 font-bold">
                    <span>Ref: {developerAccount.ref}</span>
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(developerAccount.ref, 'acc_ref')} 
                      className="hover:text-purple-950 cursor-pointer p-0.5 rounded hover:bg-purple-100"
                      title="Copier la référence de compte"
                    >
                      {copiedText === 'acc_ref' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-purple-500" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between">
              <span className={`text-[11px] font-black flex items-center gap-1.5 ${developerAccount.isValidated ? 'text-emerald-700' : 'text-rose-600'}`}>
                <span className={`w-2 h-2 rounded-full ${developerAccount.isValidated ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                <span>{developerAccount.isValidated ? 'Compte : Validé (Prod)' : 'Compte : Non Validé'}</span>
              </span>
              
              {!developerAccount.isValidated ? (
                <button 
                  type="button"
                  onClick={handleRequestValidation}
                  disabled={developerAccount.requestPending}
                  className="text-[10px] font-extrabold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                >
                  {developerAccount.requestPending ? 'En examen...' : 'Valider'}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  100k req/j
                </span>
              )}
            </div>
          </div>
'''

content = content.replace(
    "          {/* Section 1: GUIDE & ACCUEIL */}",
    sidebar_dev_header + "\n          {/* Section 1: GUIDE & ACCUEIL */}"
)

# 4. In sidebar: Add `>_ API` section (matching image 2 with Événements, Logs, Webhooks)
sidebar_api_section = '''
          {/* Section >_ API (Inspired by developer console: Événements, Logs, Webhooks) */}
          <div className="space-y-1">
            <div className="text-[10px] font-black text-indigo-700 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>&gt;_ API</span>
            </div>
            {[
              { id: 'EVENTS', label: 'Événements', icon: Radio },
              { id: 'LOGS', label: 'Logs', icon: FileSpreadsheet },
              { id: 'WEBHOOKS', label: 'Webhooks', icon: Bell }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApiPortalTab)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#009A63] text-slate-900 shadow-sm border border-emerald-600'
                      : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-950 font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2.25] ${isActive ? 'text-slate-900' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
'''

# Replace Section 3: INTÉGRATION to keep KEYS & SDK, and add >_ API section
old_integration = """          {/* Section 3: INTÉGRATION */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              INTÉGRATION
            </div>
            {[
              { id: 'KEYS', label: 'Clés API & Quotas', icon: Key },
              { id: 'SDK', label: 'SDK & Exemples', icon: Boxes },
              { id: 'WEBHOOKS', label: 'Webhooks', icon: Bell }
            ].map(item => {"""

new_integration = sidebar_api_section + """
          {/* Section: INTÉGRATION */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              INTÉGRATION
            </div>
            {[
              { id: 'KEYS', label: 'Clés API & Quotas', icon: Key },
              { id: 'SDK', label: 'SDK & Exemples', icon: Boxes }
            ].map(item => {"""

content = content.replace(old_integration, new_integration)

# 5. Insert LOGS and EVENTS tab views right after TAB: WEBHOOKS
logs_and_events_views = '''
          {/* TAB: LOGS (Console de Logs d'appels API en temps réel) */}
          {activeTab === 'LOGS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-extrabold text-slate-900">Console de Logs d'Appels API Live</h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Surveillance en temps réel de toutes les requêtes exécutées avec votre clé API Galenis Togo.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateApiCall}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simuler un appel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apiLogs, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `galenis_api_logs_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Metric KPI Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Volume Total 24h</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{apiLogs.length + 1480} reqs</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+12% vs hier</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Taux de Succès</span>
                  <div className="text-xl font-black text-emerald-900 mt-1">98.8 %</div>
                  <span className="text-[10px] text-emerald-700 font-bold">200 OK & 201 Created</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Latence Moyenne</span>
                  <div className="text-xl font-black text-slate-900 mt-1">41 ms</div>
                  <span className="text-[10px] text-slate-500 font-medium">Lomé Edge Cloud</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-800">Erreurs / 429</span>
                  <div className="text-xl font-black text-amber-900 mt-1">
                    {apiLogs.filter(l => l.status >= 400).length}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">Quota ou 404</span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'ALL', label: 'Tous les logs' },
                    { id: '200', label: '200 OK (Succès)' },
                    { id: '429', label: '429 (Rate Limit)' },
                    { id: 'ERRORS', label: 'Erreurs (4xx / 5xx)' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setLogFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        logFilter === filter.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={e => setLogSearchQuery(e.target.value)}
                    placeholder="Filtrer par route, ID..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Interactive Logs Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-[11px] text-slate-600 font-extrabold uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Statut</th>
                      <th className="py-2.5 px-4">Méthode</th>
                      <th className="py-2.5 px-4">Endpoint / Route</th>
                      <th className="py-2.5 px-4">Latence</th>
                      <th className="py-2.5 px-4">Horodatage</th>
                      <th className="py-2.5 px-4">Trace ID</th>
                      <th className="py-2.5 px-4 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apiLogs
                      .filter(log => {
                        if (logFilter === '200') return log.status >= 200 && log.status < 300;
                        if (logFilter === '429') return log.status === 429;
                        if (logFilter === 'ERRORS') return log.status >= 400 && log.status !== 429;
                        return true;
                      })
                      .filter(log => {
                        if (!logSearchQuery) return true;
                        return log.path.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                               log.id.toLowerCase().includes(logSearchQuery.toLowerCase());
                      })
                      .map(log => {
                        const is2xx = log.status >= 200 && log.status < 300;
                        const is429 = log.status === 429;
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-4">
                              <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                                is2xx ? 'bg-emerald-100 text-emerald-800' :
                                is429 ? 'bg-amber-100 text-amber-900' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {log.status} {log.statusText}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-800">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                log.method === 'GET' ? 'bg-blue-100 text-blue-800 font-black' : 'bg-purple-100 text-purple-800 font-black'
                              }`}>
                                {log.method}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {log.path}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 font-semibold">
                              {log.latencyMs} ms
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                              {log.timestamp}
                            </td>
                            <td className="py-2.5 px-4 text-slate-400 text-[10px]">
                              {log.id}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedLogDetail(log)}
                                className="text-emerald-700 hover:text-emerald-800 font-sans font-extrabold text-xs underline cursor-pointer"
                              >
                                Inspecter
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Inspector Modal for selected log */}
              {selectedLogDetail && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-400">TRACE ID: {selectedLogDetail.id}</div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-xs rounded font-black">{selectedLogDetail.method}</span>
                          <span className="font-mono text-sm">{selectedLogDetail.path}</span>
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedLogDetail(null)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">CODE HTTP</span>
                        <span className="font-black text-slate-900">{selectedLogDetail.status} {selectedLogDetail.statusText}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">LATENCE</span>
                        <span className="font-black text-slate-900">{selectedLogDetail.latencyMs} ms</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">CLIENT IP</span>
                        <span className="font-bold text-slate-900 truncate block">{selectedLogDetail.ip}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold block">HORODATAGE</span>
                        <span className="font-bold text-slate-900">{selectedLogDetail.timestamp}</span>
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-700 uppercase">En-têtes de Requête (Request Headers)</div>
                      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs space-y-1">
                        <div><span className="text-slate-400">X-API-Key:</span> <span className="text-amber-300">{selectedLogDetail.keyId}</span></div>
                        <div><span className="text-slate-400">User-Agent:</span> <span className="text-emerald-400">{selectedLogDetail.userAgent}</span></div>
                        <div><span className="text-slate-400">Accept:</span> <span className="text-blue-300">application/json</span></div>
                      </div>
                    </div>

                    {/* Response Payload JSON */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 uppercase">
                        <span>Corps de Réponse (Response Payload JSON)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(JSON.stringify(selectedLogDetail.responsePayload, null, 2), 'log_payload')}
                          className="text-emerald-700 hover:text-emerald-800 text-[10px] font-sans flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'log_payload' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copier JSON</span>
                        </button>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-48">
                        <pre>{JSON.stringify(selectedLogDetail.responsePayload, null, 2)}</pre>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLogDetail(null)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Fermer l'inspecteur
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EVENTS (Événements de Santé en direct) */}
          {activeTab === 'EVENTS' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-extrabold text-slate-900">Événements Santé & Système Galenis</h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Flux centralisé des événements diffusés sur le réseau national togolais (gardes, stocks, alertes DPML).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerTestEvent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Déclencher un événement test</span>
                </button>
              </div>

              {/* Event Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'ALL', label: 'Tous les flux' },
                  { id: 'GUARD', label: 'Rotations de Gardes' },
                  { id: 'STOCK', label: 'Ruptures & Stocks' },
                  { id: 'SYSTEM', label: 'Système & Webhooks' },
                  { id: 'SECURITY', label: 'Sécurité & Clés' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventCategoryFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      eventCategoryFilter === item.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Events Stream Cards */}
              <div className="space-y-3">
                {systemEvents
                  .filter(evt => eventCategoryFilter === 'ALL' || evt.category === eventCategoryFilter)
                  .map(evt => {
                    const isGuard = evt.category === 'GUARD';
                    const isStock = evt.category === 'STOCK';
                    const isSecurity = evt.category === 'SECURITY';
                    return (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all bg-white hover:bg-slate-50/50 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isGuard ? 'bg-emerald-100 text-emerald-800' :
                              isStock ? 'bg-amber-100 text-amber-900' :
                              isSecurity ? 'bg-rose-100 text-rose-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {evt.event}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">{evt.summary}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <div className="text-[11px] text-slate-500 font-medium">
                            Émetteur officiel : <span className="font-bold text-slate-700">{evt.source}</span>
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">ID: {evt.id}</div>
                        </div>

                        <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto">
                          <span className="text-slate-400 text-[10px] block mb-1 uppercase font-sans font-bold">Données associées (Payload) :</span>
                          <pre className="text-emerald-400">{JSON.stringify(evt.payload, null, 2)}</pre>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
'''

# Find end of TAB: WEBHOOKS
target_marker = "              {/* Webhook Log History */}"
# Let's find the closing tag for activeTab === 'WEBHOOKS'
pos = content.find(target_marker)
if pos != -1:
    close_pos = content.find("          )}", pos)
    if close_pos != -1:
        insert_at = close_pos + len("          )}")
        content = content[:insert_at] + "\n\n" + logs_and_events_views + content[insert_at:]
        print("LOGS and EVENTS views inserted successfully!")

with open("src/components/ApiPortal/ApiPortalView.tsx", "w") as f:
    f.write(content)

print("ApiPortalView successfully updated!")
