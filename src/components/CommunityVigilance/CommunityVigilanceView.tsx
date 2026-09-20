import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Pharmacy, 
  SanitaryAlert, 
  CommunityReport, 
  PharmacyReview, 
  ActivityLogItem, 
  ReportCategory 
} from '../../types';
import { 
  getSanitaryAlerts, 
  getCommunityReports, 
  getPharmacyReviews, 
  getActivityLogs,
  upvoteCommunityReport,
  likePharmacyReview,
  replyToPharmacyReview,
  updateCommunityReportStatus
} from '../../services/pharmacyStorage';
import { NewReportModal } from './NewReportModal';
import { NewReviewModal } from './NewReviewModal';
import { AlertDetailModal } from './AlertDetailModal';
import { TogoLionIcon } from '../TogoEmblems';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MessageSquareHeart, 
  Activity, 
  Star, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  ThumbsUp, 
  Plus, 
  Eye, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  User, 
  FileText, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  MessageCircle,
  Send,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface CommunityVigilanceViewProps {
  pharmacies?: Pharmacy[];
  onOpenPharmacy?: (pharmacy: Pharmacy) => void;
  defaultSubTab?: 'REPORTS' | 'ALERTS' | 'REVIEWS' | 'ACTIVITIES';
}

export const CommunityVigilanceView: React.FC<CommunityVigilanceViewProps> = ({
  pharmacies = [],
  onOpenPharmacy,
  defaultSubTab = 'REPORTS'
}) => {
  const [subTab, setSubTab] = useState<'REPORTS' | 'ALERTS' | 'REVIEWS' | 'ACTIVITIES'>(defaultSubTab);

  // Loaded data state
  const [alerts, setAlerts] = useState<SanitaryAlert[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [reviews, setReviews] = useState<PharmacyReview[]>([]);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<SanitaryAlert | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [selectedReportStatus, setSelectedReportStatus] = useState<'ALL' | 'PENDING' | 'INVESTIGATING' | 'RESOLVED'>('ALL');
  const [selectedAlertSeverity, setSelectedAlertSeverity] = useState<'ALL' | 'CRITIQUE' | 'VIGILANCE' | 'INFO'>('ALL');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'ALL'>('ALL');

  // Inline review reply box state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyPharmacistName, setReplyPharmacistName] = useState('');
  const [replyText, setReplyText] = useState('');

  const refreshAllData = () => {
    setAlerts(getSanitaryAlerts());
    setReports(getCommunityReports());
    setReviews(getPharmacyReviews());
    setActivities(getActivityLogs());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleUpvoteReport = (reportId: string) => {
    upvoteCommunityReport(reportId);
    setReports(getCommunityReports());
  };

  const handleLikeReview = (reviewId: string) => {
    likePharmacyReview(reviewId);
    setReviews(getPharmacyReviews());
  };

  const handleSendReply = (reviewId: string) => {
    if (!replyPharmacistName.trim() || !replyText.trim()) return;
    replyToPharmacyReview(reviewId, replyPharmacistName.trim(), replyText.trim());
    setReplyingReviewId(null);
    setReplyPharmacistName('');
    setReplyText('');
    setReviews(getPharmacyReviews());
  };

  // Filtered lists
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.pharmacyName && r.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'Toutes' || r.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesStatus = selectedReportStatus === 'ALL' || r.status === selectedReportStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'Toutes' || a.region === 'Toutes' || a.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesSeverity = selectedAlertSeverity === 'ALL' || a.severity === selectedAlertSeverity;

    return matchesSearch && matchesRegion && matchesSeverity;
  });

  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = selectedRatingFilter === 'ALL' || rev.rating === selectedRatingFilter;

    return matchesSearch && matchesRating;
  });

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const pendingReportsCount = reports.filter(r => r.status === 'PENDING' || r.status === 'INVESTIGATING').length;
  const resolvedReportsCount = reports.filter(r => r.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner with Stats & Vision */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 border-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border-emerald-200 text-emerald-700 border border-[#00A878]/40 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Entraide & Alertes Santé Togo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Avis des citoyens & Alertes santé
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Partagez votre expérience en pharmacie, signalez un problème (horaires, prix) et consultez les alertes officielles de santé au Togo.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Signaler un problème</span>
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#00A878] hover:bg-[#009267] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <TogoLionIcon className="w-4 h-4 text-amber-300" />
              <span>Donner mon avis</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#0E7490]/60">
          <div 
            onClick={() => setSubTab('REPORTS')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              subTab === 'REPORTS' 
                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1">
              <span>Problèmes signalés</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{reports.length}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">{resolvedReportsCount} résolus avec succès</div>
          </div>

          <div 
            onClick={() => setSubTab('ALERTS')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              subTab === 'ALERTS' 
                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-600 font-semibold mb-1">
              <span>Alertes santé</span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{alerts.length}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">{activeAlertsCount} prioritaires actives</div>
          </div>

          <div 
            onClick={() => setSubTab('REVIEWS')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              subTab === 'REVIEWS' 
                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
              <span>Avis sur les pharmacies</span>
              <MessageSquareHeart className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{reviews.length}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Avis vérifiés</div>
          </div>

          <div 
            onClick={() => setSubTab('ACTIVITIES')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              subTab === 'ACTIVITIES' 
                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
              <span>Journal Réseau</span>
              <Activity className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{activities.length}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Mises à jour directes</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSubTab('REPORTS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'REPORTS'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>1. Signalements Citoyens ({reports.length})</span>
          </button>

          <button
            onClick={() => setSubTab('ALERTS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'ALERTS'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>2. Alertes Sanitaires ({alerts.length})</span>
          </button>

          <button
            onClick={() => setSubTab('REVIEWS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'REVIEWS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>3. Retours d'Expérience ({reviews.length})</span>
          </button>

          <button
            onClick={() => setSubTab('ACTIVITIES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'ACTIVITIES'
                ? 'bg-blue-600 text-slate-900 shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>4. Journal d'Activités ({activities.length})</span>
          </button>
        </div>

        {/* Dynamic Search & Region Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
          >
            <option value="Toutes">Toutes Régions</option>
            <option value="Maritime">Maritime (Lomé)</option>
            <option value="Plateaux">Plateaux</option>
            <option value="Centrale">Centrale</option>
            <option value="Kara">Kara</option>
            <option value="Savanes">Savanes</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODULE SIGNALEMENTS (Community Reports)                                */}
      {/* ========================================================================= */}
      {subTab === 'REPORTS' && (
        <div className="space-y-4">
          
          {/* Status Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 mr-1">Filtrer par statut :</span>
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'PENDING', label: '⏳ En attente' },
                { id: 'INVESTIGATING', label: '🔍 Enquête en cours' },
                { id: 'RESOLVED', label: '✓ Résolus' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedReportStatus(st.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedReportStatus === st.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau signalement</span>
            </button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(report => {
              const pharma = pharmacies.find(p => p.id === report.pharmacyId);
              return (
                <div 
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Category & Status Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          report.urgency === 'URGENTE'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : report.urgency === 'HAUTE'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {report.urgency === 'URGENTE' ? '🚨 Urgence Immédiate' : `Urgence ${report.urgency}`}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          report.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : report.status === 'INVESTIGATING'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {report.status === 'RESOLVED' && '✓ Anomalie Résolue'}
                          {report.status === 'INVESTIGATING' && '🔍 Enquête Terrain en cours'}
                          {report.status === 'PENDING' && '⏳ En attente de vérification'}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {report.createdAt.split('T')[0]}
                      </span>
                    </div>

                    {/* Target Pharmacy or General City */}
                    <div className="mb-2">
                      {report.pharmacyName ? (
                        <h3 
                          onClick={() => pharma && onOpenPharmacy && onOpenPharmacy(pharma)}
                          className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer flex items-center gap-1.5"
                        >
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{report.pharmacyName}</span>
                        </h3>
                      ) : (
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Signalement Général ({report.city})</span>
                        </h3>
                      )}
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {report.city} • Région {report.region}
                      </p>
                    </div>

                    {/* Motive Tag */}
                    <div className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-bold mb-2">
                      Motif : {report.category.replace(/_/g, ' ')}
                    </div>

                    {/* Description Text */}
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      « {report.description} »
                    </p>

                    {/* Resolution Note if resolved */}
                    {report.resolutionNotes && (
                      <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Note de résolution officielle :</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-snug">
                          {report.resolutionNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer & Upvote */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Signalé par <strong>{report.reporterName}</strong>
                    </span>

                    <button
                      onClick={() => handleUpvoteReport(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                      title="Confirmer cette information sur le terrain"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Confirmer ({report.upvotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <AlertTriangle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-700">Aucun signalement correspondant</p>
                <p className="text-xs text-slate-400 mt-1">Tous les services officinaux fonctionnent normalement.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODULE ALERTES SANITAIRES (Health & Epidemic Alerts)                   */}
      {/* ========================================================================= */}
      {subTab === 'ALERTS' && (
        <div className="space-y-4">
          
          {/* Severity filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 mr-1">Filtrer par sévérité :</span>
              {[
                { id: 'ALL', label: 'Toutes les alertes' },
                { id: 'CRITIQUE', label: '🚨 Retraits & Rappels Critiques' },
                { id: 'VIGILANCE', label: '⚠️ Vigilance Palu / Épidémies' },
                { id: 'INFO', label: 'ℹ️ Mises en garde & Infos' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedAlertSeverity(st.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedAlertSeverity === st.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-500">
              Source officielle Ministère de la Santé & Ordre des Pharmaciens du Togo
            </span>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-lg relative ${
                  alert.severity === 'CRITIQUE'
                    ? 'border-rose-300 ring-2 ring-rose-400/20'
                    : alert.severity === 'VIGILANCE'
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide flex items-center gap-1 ${
                        alert.severity === 'CRITIQUE'
                          ? 'bg-rose-600 text-white'
                          : alert.severity === 'VIGILANCE'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-600 text-slate-900'
                      }`}>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {alert.severity === 'CRITIQUE' ? 'RAPPEL CRITIQUE' : alert.severity === 'VIGILANCE' ? 'VIGILANCE SANITAIRE' : 'INFO SANTÉ'}
                      </span>

                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {alert.category.replace(/_/g, ' ')}
                      </span>

                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {alert.publishedAt}
                      </span>

                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.region === 'Toutes' ? 'National (Togo)' : alert.region}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {alert.summary}
                    </p>

                    {/* Affected lots pills */}
                    {alert.affectedProducts && alert.affectedProducts.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-rose-800">Lots concernés :</span>
                        {alert.affectedProducts.map((p, idx) => (
                          <span key={idx} className="bg-rose-50 border border-rose-200 text-rose-900 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0">
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                      Émetteur : <strong>{alert.source}</strong>
                    </span>

                    <button
                      onClick={() => setSelectedAlertForDetail(alert)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lire l'avis officiel</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                <p className="font-bold text-sm text-slate-700">Aucune alerte sanitaire active pour ces critères</p>
                <p className="text-xs text-slate-400 mt-1">La situation sanitaire et l'approvisionnement sont stables.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODULE RETOURS D'EXPÉRIENCE (Reviews & Ratings)                        */}
      {/* ========================================================================= */}
      {subTab === 'REVIEWS' && (
        <div className="space-y-4">
          
          {/* Star Filter & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 mr-1">Filtrer par note :</span>
              {[
                { id: 'ALL', label: 'Toutes les notes' },
                { id: 5, label: '5 ⭐⭐⭐⭐⭐' },
                { id: 4, label: '4 ⭐⭐⭐⭐' },
                { id: 3, label: '3 ⭐⭐⭐' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedRatingFilter(st.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedRatingFilter === st.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Rédiger un avis</span>
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map(rev => {
              const pharma = pharmacies.find(p => p.id === rev.pharmacyId);
              return (
                <div 
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Header with Pharmacy & Stars */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 
                          onClick={() => pharma && onOpenPharmacy && onOpenPharmacy(pharma)}
                          className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer flex items-center gap-1.5"
                        >
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{rev.pharmacyName}</span>
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {rev.city}
                        </p>
                      </div>

                      {/* Stars badge */}
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(st => (
                            <Star 
                              key={st} 
                              className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-900 ml-1">{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Criteria Mini Breakdown */}
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2 rounded-xl text-[10px] font-bold text-slate-700 mb-3 border border-slate-100">
                      <div className="text-center">
                        <span className="block text-slate-400 font-medium">Accueil</span>
                        <span className="text-emerald-700">{rev.criteria.accueil}/5</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-slate-400 font-medium">Attente</span>
                        <span className="text-emerald-700">{rev.criteria.delaiAttente}/5</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-slate-400 font-medium">Stock</span>
                        <span className="text-emerald-700">{rev.criteria.disponibiliteStock}/5</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-slate-400 font-medium">Tarifs</span>
                        <span className="text-emerald-700">{rev.criteria.respectPrix}/5</span>
                      </div>
                    </div>

                    {/* Review Title & Comment */}
                    <h4 className="font-bold text-slate-900 text-xs mb-1">
                      « {rev.title} »
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Tags */}
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {rev.tags.map((t, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md text-[10.5px] font-medium">
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pharmacy Official Reply if exists */}
                    {rev.pharmacyResponse && (
                      <div className="mt-3 bg-slate-50 border-l-4 border-emerald-600 p-3 rounded-r-xl text-xs space-y-1">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Réponse de l'officine ({rev.pharmacyResponse.responderName})</span>
                        </div>
                        <p className="text-[11px] text-slate-700 italic leading-snug">
                          « {rev.pharmacyResponse.comment} »
                        </p>
                      </div>
                    )}

                    {/* Reply form toggle */}
                    {replyingReviewId === rev.id && (
                      <div className="mt-3 bg-slate-100 p-3 rounded-xl space-y-2 border border-slate-200 animate-in fade-in duration-150">
                        <span className="block font-bold text-slate-800 text-[11px]">
                          Droit de réponse professionnel (Pharmacie)
                        </span>
                        <input
                          type="text"
                          value={replyPharmacistName}
                          onChange={e => setReplyPharmacistName(e.target.value)}
                          placeholder="Nom & Titre (ex: Dr. Komlan, Titulaire)"
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
                        />
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Votre réponse bienveillante au patient..."
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyingReviewId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 font-bold"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleSendReply(rev.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm"
                          >
                            Publier la réponse
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Par <strong>{rev.authorName}</strong> ({rev.createdAt.split('T')[0]})
                    </span>

                    <div className="flex items-center gap-2">
                      {!rev.pharmacyResponse && replyingReviewId !== rev.id && (
                        <button
                          onClick={() => setReplyingReviewId(rev.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition-colors"
                        >
                          Répondre
                        </button>
                      )}

                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Utile ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReviews.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <MessageSquareHeart className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-700">Aucun avis trouvé</p>
                <p className="text-xs text-slate-400 mt-1">Soyez le premier à partager votre expérience officinale !</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODULE ACTIVITÉS (Live Event Stream & Network Stats)                   */}
      {/* ========================================================================= */}
      {subTab === 'ACTIVITIES' && (
        <div className="space-y-6">
          
          {/* Transparency Metrics Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Fiabilité du Référentiel</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-slate-900">99.4 %</div>
              <p className="text-xs text-slate-500 leading-snug">
                Taux d'exactitude vérifié sur les gardes et numéros de téléphone déclarés au Togo.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                <span>Résolution des Signalements</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-slate-900">{resolvedReportsCount} / {reports.length}</div>
              <p className="text-xs text-slate-500 leading-snug">
                Délai moyen de prise en charge : <strong>3 heures</strong> après notification citoyenne.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Engagement Communautaire</span>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-slate-900">{reviews.length + reports.length}</div>
              <p className="text-xs text-slate-500 leading-snug">
                Contributions citoyennes et retours d'usagers enregistrés ce mois-ci.
              </p>
            </div>
          </div>

          {/* Activity Stream Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Flux d'activités & mises à jour en direct</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Réseau synchronisé</span>
              </span>
            </div>

            <div className="space-y-4">
              {activities.map((act, index) => (
                <div key={act.id} className="flex items-start gap-3 relative pb-4 last:pb-0">
                  {/* Timeline connector line */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100" />
                  )}

                  {/* Icon badge */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs z-10 ${
                    act.type === 'ALERT_ISSUED' 
                      ? 'bg-amber-100 text-amber-800' 
                      : act.type === 'REPORT_RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.type === 'REPORT_SUBMITTED'
                      ? 'bg-rose-100 text-rose-800'
                      : act.type === 'REVIEW_ADDED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {act.type === 'ALERT_ISSUED' && <ShieldAlert className="w-4 h-4" />}
                    {act.type === 'REPORT_RESOLVED' && <CheckCircle2 className="w-4 h-4" />}
                    {act.type === 'REPORT_SUBMITTED' && <AlertTriangle className="w-4 h-4" />}
                    {act.type === 'REVIEW_ADDED' && <TogoLionIcon className="w-4 h-4 text-amber-600" />}
                    {act.type === 'GUARD_UPDATED' && <Calendar className="w-4 h-4" />}
                    {act.type === 'PHARMACY_VERIFIED' && <ShieldCheck className="w-4 h-4" />}
                  </div>

                  {/* Details */}
                  <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-xs">
                        {act.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {act.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-[10.5px] text-slate-500 font-medium">
                      {act.region && (
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          📍 {act.region}
                        </span>
                      )}
                      {act.userRole && (
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          Rôle : {act.userRole}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      {createPortal(
        <>
          {isReportModalOpen && (
            <NewReportModal
              pharmacies={pharmacies}
              onClose={() => setIsReportModalOpen(false)}
              onSuccess={() => {
                refreshAllData();
              }}
            />
          )}

          {isReviewModalOpen && (
            <NewReviewModal
              pharmacies={pharmacies}
              onClose={() => setIsReviewModalOpen(false)}
              onSuccess={() => {
                refreshAllData();
              }}
            />
          )}

          {selectedAlertForDetail && (
            <AlertDetailModal
              alert={selectedAlertForDetail}
              onClose={() => setSelectedAlertForDetail(null)}
            />
          )}
        </>,
        document.body
      )}

    </div>
  );
};
