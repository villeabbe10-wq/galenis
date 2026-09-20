import React, { useState, useEffect } from 'react';
import { 
  AdBanner, 
  AdPlacement, 
  AdCategory, 
  AdStatus 
} from '../../types';
import { 
  getAdBanners, 
  saveAdBanner, 
  deleteAdBanner, 
  toggleAdBannerStatus 
} from '../../services/pharmacyStorage';
import { 
  DollarSign, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  ExternalLink, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Calculator, 
  HelpCircle, 
  Layers, 
  CreditCard, 
  ArrowUpRight, 
  FileText,
  Sliders,
  Wallet,
  Coins,
  Receipt
} from 'lucide-react';

interface AdminMonetizationManagementProps {
  onShowToast?: (message: string) => void;
}

export const AdminMonetizationManagement: React.FC<AdminMonetizationManagementProps> = ({
  onShowToast
}) => {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'strategy' | 'calculator' | 'invoicing'>('banners');
  const [filterPlacement, setFilterPlacement] = useState<string>('ALL');
  
  // Banner Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    advertiser: '',
    category: 'LABORATOIRE' as AdCategory,
    placement: 'HOME_TOP' as AdPlacement,
    badgeText: 'Partenaire Santé Officiel',
    callToAction: 'En savoir plus',
    targetUrl: '',
    targetPhone: '',
    targetWhatsapp: '',
    status: 'ACTIVE' as AdStatus,
    monthlyFeeFcfa: 150000,
    paymentStatus: 'PAID' as 'PAID' | 'PENDING' | 'OVERDUE',
    paymentMethod: 'TMONEY' as 'TMONEY' | 'FLOOZ' | 'VIREMENT' | 'CHEQUE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    notes: ''
  });

  // Simulator State
  const [simAdvertisersCount, setSimAdvertisersCount] = useState(4);
  const [simAvgBannerFee, setSimAvgBannerFee] = useState(150000);
  const [simPremiumPharmacies, setSimPremiumPharmacies] = useState(25);
  const [simPharmacyMonthlyFee, setSimPharmacyMonthlyFee] = useState(15000);
  const [simApiSubscribers, setSimApiSubscribers] = useState(6);
  const [simApiMonthlyFee, setSimApiMonthlyFee] = useState(45000);
  const [simEstimatedMonthlyCosts, setSimEstimatedMonthlyCosts] = useState(45000);

  const loadData = () => {
    setBanners(getAdBanners());
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMonthlyRevenue = banners
    .filter(b => b.status === 'ACTIVE')
    .reduce((sum, b) => sum + (b.monthlyFeeFcfa || 0), 0);

  const totalImpressions = banners.reduce((sum, b) => sum + (b.impressions || 0), 0);
  const totalClicks = banners.reduce((sum, b) => sum + (b.clicks || 0), 0);
  const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const handleOpenCreate = () => {
    setEditingBannerId(null);
    setFormData({
      title: '',
      subtitle: '',
      advertiser: '',
      category: 'LABORATOIRE',
      placement: 'HOME_TOP',
      badgeText: 'Partenaire Officiel Santé',
      callToAction: 'En savoir plus',
      targetUrl: 'https://',
      targetPhone: '+228 ',
      targetWhatsapp: '228',
      status: 'ACTIVE',
      monthlyFeeFcfa: 150000,
      paymentStatus: 'PAID',
      paymentMethod: 'TMONEY',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: AdBanner) => {
    setEditingBannerId(b.id);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      advertiser: b.advertiser,
      category: b.category,
      placement: b.placement,
      badgeText: b.badgeText || 'Partenaire Officiel',
      callToAction: b.callToAction || 'En savoir plus',
      targetUrl: b.targetUrl || '',
      targetPhone: b.targetPhone || '',
      targetWhatsapp: b.targetWhatsapp || '',
      status: b.status,
      monthlyFeeFcfa: b.monthlyFeeFcfa || 0,
      paymentStatus: b.paymentStatus || 'PAID',
      paymentMethod: b.paymentMethod || 'TMONEY',
      startDate: b.startDate || '',
      endDate: b.endDate || '',
      notes: b.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.advertiser) {
      alert('Veuillez renseigner le titre et le nom de l\'annonceur.');
      return;
    }

    saveAdBanner({
      ...(editingBannerId ? { id: editingBannerId } : {}),
      title: formData.title,
      subtitle: formData.subtitle,
      advertiser: formData.advertiser,
      category: formData.category,
      placement: formData.placement,
      badgeText: formData.badgeText,
      callToAction: formData.callToAction,
      targetUrl: formData.targetUrl,
      targetPhone: formData.targetPhone,
      targetWhatsapp: formData.targetWhatsapp,
      status: formData.status,
      monthlyFeeFcfa: Number(formData.monthlyFeeFcfa) || 0,
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes
    });

    setIsModalOpen(false);
    loadData();
    if (onShowToast) onShowToast(editingBannerId ? 'Bannière publicitaire mise à jour avec succès.' : 'Nouvelle bannière sponsorisée activée !');
  };

  const handleToggle = (id: string) => {
    toggleAdBannerStatus(id);
    loadData();
    if (onShowToast) onShowToast('Statut de la bannière modifié.');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirmer la suppression de cette bannière publicitaire ?')) {
      deleteAdBanner(id);
      loadData();
      if (onShowToast) onShowToast('Bannière supprimée.');
    }
  };

  const filteredBanners = filterPlacement === 'ALL' 
    ? banners 
    : banners.filter(b => b.placement === filterPlacement);

  // Projected calculations
  const simAdsRevenue = simAdvertisersCount * simAvgBannerFee;
  const simPharmaciesRevenue = simPremiumPharmacies * simPharmacyMonthlyFee;
  const simApiRevenue = simApiSubscribers * simApiMonthlyFee;
  const simTotalGrossRevenue = simAdsRevenue + simPharmaciesRevenue + simApiRevenue;
  const simNetProfit = simTotalGrossRevenue - simEstimatedMonthlyCosts;
  const simMarginPercent = simTotalGrossRevenue > 0 ? ((simNetProfit / simTotalGrossRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Régie Publicitaire & Modèle Économique National</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Monétisation, Bannières & Revenus Galenis
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Générez des revenus récurrents auprès des laboratoires pharmaceutiques, mutuelles et cliniques du Togo pour couvrir l'hébergement serveur, pérenniser l'infrastructure et rémunérer la plateforme.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Nouvelle Bannière Sponsor</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Financial & Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Revenu Mensuel Pub</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalMonthlyRevenue.toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-600">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{banners.filter(b => b.status === 'ACTIVE').length} bannières actives en cours</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Impressions Totales</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalImpressions.toLocaleString('fr-FR')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Affichages garantis aux citoyens togolais
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Clics & Conversions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalClicks.toLocaleString('fr-FR')} <span className="text-xs font-bold text-purple-600">({averageCtr}% CTR)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Redirections directes WhatsApp & Web
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Couverture Coûts Serveur</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            ~14.8x
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Coûts Cloud Run/Firebase largement autofinancés
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('banners')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'banners'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bannières Publicitaires ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('strategy')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'strategy'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>5 Pistes de Monétisation Santé</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'calculator'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Simulateur de Rentabilité</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoicing')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'invoicing'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Facturation & Rapprochement</span>
        </button>
      </div>

      {/* SUB-TAB 1: BANNERS AD SERVER */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700">Filtrer par emplacement :</span>
              {[
                { id: 'ALL', label: 'Tous les emplacements' },
                { id: 'HOME_TOP', label: 'Haut Accueil' },
                { id: 'DRUG_SEARCH', label: 'Recherche Médicament' },
                { id: 'HOME_BOTTOM', label: 'Bas Accueil' },
                { id: 'CITIZEN_DASHBOARD', label: 'Espace Citoyen' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilterPlacement(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterPlacement === opt.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              {filteredBanners.length} annonce(s) affichée(s)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredBanners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                Aucune bannière pour cet emplacement. Cliquez sur "Nouvelle Bannière Sponsor" pour en ajouter une.
              </div>
            ) : (
              filteredBanners.map(b => (
                <div 
                  key={b.id}
                  className={`bg-white rounded-2xl border ${
                    b.status === 'ACTIVE' ? 'border-emerald-200 shadow-xs' : 'border-slate-200 opacity-75'
                  } p-5 transition-all hover:shadow-md`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0 max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          b.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {b.status === 'ACTIVE' ? '● En diffusion active' : '⏸ En pause'}
                        </span>
                        <span className="text-xs font-black text-slate-900">{b.advertiser}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs font-semibold text-slate-600">Catégorie: {b.category}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Emplacement: {b.placement}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-slate-900 leading-snug">{b.title}</h4>
                        {b.subtitle && (
                          <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">{b.subtitle}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap pt-1">
                        <span className="font-black text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                          Forfait: {b.monthlyFeeFcfa.toLocaleString('fr-FR')} FCFA / mois
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{b.impressions.toLocaleString('fr-FR')}</strong> vues
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{b.clicks.toLocaleString('fr-FR')}</strong> clics ({b.impressions > 0 ? ((b.clicks/b.impressions)*100).toFixed(1) : 0}% CTR)
                        </span>
                        {b.paymentStatus === 'PAID' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Règlement validé ({b.paymentMethod})
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" /> En attente de paiement
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <button
                        onClick={() => handleToggle(b.id)}
                        className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                          b.status === 'ACTIVE'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                        title={b.status === 'ACTIVE' ? 'Mettre en pause' : 'Activer la diffusion'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{b.status === 'ACTIVE' ? 'Pause' : 'Activer'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Modifier la bannière"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Éditer</span>
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Supprimer la bannière"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MONETIZATION STRATEGIES */}
      {activeSubTab === 'strategy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Guide Stratégique de Rentabilisation</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                5 Modèles Économiques Éthiques pour Financer et Rentabiliser Galenis Togo
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Une plateforme de santé publique n'a pas besoin de faire payer les citoyens : les acteurs B2B (Laboratoires, Assurances, Cliniques, Pharmacies) sont prêts à rémunérer la visibilité et l'accès aux données de garde.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Levier 1 */}
              <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    01
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    100 000 à 250 000 FCFA / annonceur / mois
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Régie Publicitaire & Sponsoring Éthique Santé
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Diffusion d'emplacements sponsorisés pour les laboratoires pharmaceutiques (moustiquaires, vitamines, tests rapides), mutuelles santé (SUNU, SANLAM, NSIA) et cliniques privées du Togo. 
                  L'administrateur garde le contrôle total des visuels et valide le contenu éthique.
                </p>
                <div className="text-[11px] text-emerald-900 font-bold bg-white/80 p-2.5 rounded-xl border border-emerald-200/60">
                  🎯 <strong>Potentiel :</strong> 5 annonceurs = 750 000 à 1 250 000 FCFA / mois.
                </div>
              </div>

              {/* Levier 2 */}
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    02
                  </div>
                  <span className="text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md">
                    15 000 à 25 000 FCFA / officine / mois
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Pack "Officine Partenaire Prioritaire" (Visibilité Premium)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Les pharmacies qui souhaitent attirer plus de patients lors des tours de garde souscrivent à un pack visibilité : badge doré vérifié, affichage prioritaire en tête de liste dans leur commune/quartier, intégration du lien WhatsApp pour commandes express et photos de façade HD.
                </p>
                <div className="text-[11px] text-blue-900 font-bold bg-white/80 p-2.5 rounded-xl border border-blue-200/60">
                  🎯 <strong>Potentiel :</strong> 30 pharmacies abonnées à Lomé = 450 000 à 750 000 FCFA / mois.
                </div>
              </div>

              {/* Levier 3 */}
              <div className="bg-gradient-to-br from-purple-50/70 to-violet-50/50 border border-purple-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                    03
                  </div>
                  <span className="text-xs font-black text-purple-800 bg-purple-100 px-2.5 py-1 rounded-md">
                    25 000 à 100 000 FCFA / intégrateur / mois
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Abonnements API Développeurs & Assurances / Logiciels Médicaux
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Les éditeurs de logiciels de clinique, les applications de téléconsultation, les mutuelles et les hôpitaux ont besoin d'interroger en direct l'API des tours de garde et les prix des médicaments. Galenis propose un tier gratuit puis des forfaits API Pro/Enterprise facturés mensuellement.
                </p>
                <div className="text-[11px] text-purple-900 font-bold bg-white/80 p-2.5 rounded-xl border border-purple-200/60">
                  🎯 <strong>Potentiel :</strong> 10 entreprises intégratrices = 350 000 à 600 000 FCFA / mois.
                </div>
              </div>

              {/* Levier 4 */}
              <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                    04
                  </div>
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                    100 à 250 FCFA / réservation
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Frais de Mise en Relation & Réservations Médicaments
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Lorsqu'un patient citoyen utilise le bouton "Réserver mon médicament de garde" ou "Demande de préparation d'ordonnance", un micro-frais forfaitaire peut être facturé à la pharmacie partenaire pour chaque prescription honorée et venue au comptoir.
                </p>
                <div className="text-[11px] text-amber-900 font-bold bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  🎯 <strong>Potentiel :</strong> 1 000 réservations mensuelles = 150 000 à 250 000 FCFA / mois.
                </div>
              </div>
            </div>

            {/* Levier 5 Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase">
                    Levier 05 • Institutionnel
                  </span>
                  <span className="text-xs font-bold text-slate-400">Subventions & Accords DPML / OMS</span>
                </div>
                <h4 className="text-base font-black text-white">
                  Contrats de Service & Données Épidémiologiques pour la Santé Publique
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Présentez les rapports anonymisés d'achalandage et les alertes communautaires au Ministère de la Santé, à l'ONPT ou à des ONG partenaires pour obtenir des conventions d'appui au fonctionnement de la plateforme d'intérêt général.
                </p>
              </div>
              <a
                href="#calculator"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSubTab('calculator');
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shrink-0 transition-all"
              >
                Calculer mes gains prévisionnels
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Simulateur Interactif</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Simulateur de Chiffre d'Affaires et Marge Nette Galenis
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ajustez les curseurs pour modéliser vos revenus selon votre stratégie commerciale au Togo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sliders Area */}
              <div className="space-y-5">
                {/* 1. Bannières Pub */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-black text-slate-900">Nombre d'Annonceurs Publicitaires</label>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{simAdvertisersCount} annonceurs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simAdvertisersCount}
                    onChange={(e) => setSimAdvertisersCount(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Forfait moyen par annonceur :</span>
                    <span className="font-bold text-slate-800">{simAvgBannerFee.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                </div>

                {/* 2. Pharmacies Premium */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-black text-slate-900">Pharmacies avec Pack Visibilité Premium</label>
                    <span className="font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{simPremiumPharmacies} officines</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simPremiumPharmacies}
                    onChange={(e) => setSimPremiumPharmacies(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Abonnement par pharmacie :</span>
                    <span className="font-bold text-slate-800">{simPharmacyMonthlyFee.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                </div>

                {/* 3. API B2B */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-black text-slate-900">Clients API Développeurs / Cliniques Pro</label>
                    <span className="font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded">{simApiSubscribers} abonnés</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={simApiSubscribers}
                    onChange={(e) => setSimApiSubscribers(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Forfait mensuel API Pro :</span>
                    <span className="font-bold text-slate-800">{simApiMonthlyFee.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                </div>

                {/* 4. Coûts d'infrastructure */}
                <div className="space-y-2 bg-rose-50/50 p-4 rounded-2xl border border-rose-200/80">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-black text-rose-900">Estimation Coûts Serveurs & Nom de Domaine</label>
                    <span className="font-black text-rose-700">{simEstimatedMonthlyCosts.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="200000"
                    step="5000"
                    value={simEstimatedMonthlyCosts}
                    onChange={(e) => setSimEstimatedMonthlyCosts(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <span className="text-[10px] text-rose-600 font-medium">Hébergement Cloud Run, Firebase, SMS et nom de domaine .tg</span>
                </div>
              </div>

              {/* Projections Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">Résultats Prévisionnels</span>
                    <span className="text-xs font-bold text-slate-400">Projection Mensuelle</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>• Revenus Bannières Publicitaires :</span>
                      <span className="font-black text-white">{simAdsRevenue.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>• Packs Visibilité Pharmacies :</span>
                      <span className="font-black text-white">{simPharmaciesRevenue.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>• Abonnements API B2B :</span>
                      <span className="font-black text-white">{simApiRevenue.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400 border-t border-slate-800 pt-2">
                      <span>- Coûts d'infrastructure déduits :</span>
                      <span className="font-black">-{simEstimatedMonthlyCosts.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Bénéfice Net Mensuel Estimé</span>
                  <div className="text-3xl font-black text-emerald-400">
                    {simNetProfit.toLocaleString('fr-FR')} <span className="text-lg font-bold text-white">FCFA / mois</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Soit environ <strong>{(simNetProfit * 12).toLocaleString('fr-FR')} FCFA / an</strong> avec une marge brute de <strong>{simMarginPercent}%</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INVOICING & PAYMENT RECONCILIATION */}
      {activeSubTab === 'invoicing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Registre des Factures & Paiements Annonceurs</h4>
                <p className="text-xs text-slate-500">Suivi des règlements reçus par TMoney, Flooz ou Virement bancaire au Togo.</p>
              </div>
              <button
                onClick={() => {
                  const csv = `Annonceur,Montant_FCFA,Mode_Paiement,Statut,Date_Debut,Date_Fin\n` +
                    banners.map(b => `"${b.advertiser}",${b.monthlyFeeFcfa},"${b.paymentMethod}","${b.paymentStatus}","${b.startDate}","${b.endDate}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute("download", `registre_facturation_galenis_${Date.now()}.csv`);
                  link.click();
                  if (onShowToast) onShowToast('Export comptable téléchargé.');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Exporter CSV Comptable</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Annonceur</th>
                    <th className="py-2.5 px-3">Campagne</th>
                    <th className="py-2.5 px-3">Montant Mensuel</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Statut Paiement</th>
                    <th className="py-2.5 px-3">Échéance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-black text-slate-900">{b.advertiser}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium max-w-xs truncate">{b.title}</td>
                      <td className="py-3 px-3 font-bold text-emerald-800">{b.monthlyFeeFcfa.toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {b.paymentMethod || 'TMONEY'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          b.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.paymentStatus === 'PAID' ? 'PAYÉ' : 'EN ATTENTE'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{b.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BANNER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingBannerId ? 'Modifier la Bannière Sponsorisée' : 'Créer une Nouvelle Bannière Sponsorisée'}
                </h3>
                <p className="text-xs text-slate-500">Régie publicitaire éthique santé de Galenis Togo.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de l'Annonceur *</label>
                  <input
                    type="text"
                    required
                    value={formData.advertiser}
                    onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
                    placeholder="Ex: Laboratoires Sanofi Togo"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie Sponsor *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AdCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-bold"
                  >
                    <option value="LABORATOIRE">Laboratoire Pharmaceutique</option>
                    <option value="ASSURANCE">Assurance / Mutuelle de Santé</option>
                    <option value="CLINIQUE">Clinique / Centre Médical Agréé</option>
                    <option value="PARAPHARMACIE">Parapharmacie / Cosmétique Santé</option>
                    <option value="CAMPAGNE_SANTE">Campagne de Prévention Nationale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'Annonce (Accroche principale) *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Prise en charge à 80% avec l'Assurance Santé AMU"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-black text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sous-titre explicatif (Optionnel)</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ex: Simulez votre reste à charge et trouvez les officines conventionnées à Lomé."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emplacement de Diffusion *</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as AdPlacement })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-bold"
                  >
                    <option value="HOME_TOP">Haut Accueil (Prioritaire)</option>
                    <option value="DRUG_SEARCH">Recherche de Médicaments</option>
                    <option value="HOME_BOTTOM">Bas d'Accueil (Pied de page)</option>
                    <option value="CITIZEN_DASHBOARD">Espace Profil Citoyen / Reste à Charge</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Texte du Badge</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="Ex: Partenaire Officiel Santé"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lien Web (URL)</label>
                  <input
                    type="url"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="https://sunu-assurances.tg"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone Appel</label>
                  <input
                    type="text"
                    value={formData.targetPhone}
                    onChange={(e) => setFormData({ ...formData, targetPhone: e.target.value })}
                    placeholder="+228 22 21 00 00"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Direct</label>
                  <input
                    type="text"
                    value={formData.targetWhatsapp}
                    onChange={(e) => setFormData({ ...formData, targetWhatsapp: e.target.value })}
                    placeholder="22890000000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Forfait Mensuel (FCFA) *</label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={formData.monthlyFeeFcfa}
                    onChange={(e) => setFormData({ ...formData, monthlyFeeFcfa: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-black text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de Règlement</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="TMONEY">TMoney Togo</option>
                    <option value="FLOOZ">Moov Flooz</option>
                    <option value="VIREMENT">Virement Bancaire</option>
                    <option value="CHEQUE">Chèque Bancaire</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut Paiement</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="PAID">Payé (Validé)</option>
                    <option value="PENDING">En attente</option>
                    <option value="OVERDUE">En retard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition-all"
                >
                  {editingBannerId ? 'Enregistrer les modifications' : 'Activer la Bannière'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
