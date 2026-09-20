import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppFeedback, 
  AppFeedbackCategory, 
  AppFeedbackStatus 
} from '../../types';
import { 
  getAppFeedbacks, 
  saveAppFeedback, 
  upvoteAppFeedback 
} from '../../services/pharmacyStorage';
import { 
  X, 
  Star, 
  ThumbsUp, 
  Lightbulb, 
  Bug, 
  Smartphone, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Search, 
  MessageSquare, 
  Send, 
  Building2, 
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { TogoFlag, TogoLionIcon } from '../TogoEmblems';

interface AppFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'FORM' | 'LIST' | 'ROADMAP';
}

const CATEGORIES: { id: AppFeedbackCategory; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
  { id: 'SUGGESTION', label: 'Suggestion générale', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'ERGONOMIE', label: 'Ergonomie & Facilité', icon: Smartphone, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'FONCTIONNALITE', label: 'Nouvelle fonctionnalité', icon: Rocket, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'BUG_TECHNIQUE', label: 'Problème technique / Bug', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'DONNEES_OFFICINES', label: 'Données & Gardes', icon: Building2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'AUTRE', label: 'Autre remarque', icon: MessageSquare, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Décevant - Beaucoup de points à revoir',
  2: 'Passable - Nécessite des ajustements',
  3: 'Correct - Fonctionne bien',
  4: 'Très bon - Expérience agréable',
  5: 'Excellent - Indispensable et fluide !'
};

export const AppFeedbackModal: React.FC<AppFeedbackModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'FORM'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'FORM' | 'LIST' | 'ROADMAP'>(initialTab);
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);
  
  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<AppFeedbackCategory>('SUGGESTION');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<AppFeedback['authorRole']>('CITOYEN');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadFeedbacks = () => {
    setFeedbacks(getAppFeedbacks());
  };

  useEffect(() => {
    if (isOpen) {
      loadFeedbacks();
      setSubmittedSuccess(false);
      if (initialTab) setActiveSubTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    saveAppFeedback({
      category,
      title,
      description,
      rating,
      authorName,
      authorRole,
      emailOrPhone
    });

    loadFeedbacks();
    setSubmittedSuccess(true);
    setTitle('');
    setDescription('');
  };

  const handleUpvote = (id: string) => {
    upvoteAppFeedback(id);
    loadFeedbacks();
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = 
      fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'ALL' || fb.category === selectedCategoryFilter;
    const matchesStatus = statusFilter === 'ALL' || fb.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const implementedCount = feedbacks.filter(f => f.status === 'IMPLEMENTED').length;
  const plannedCount = feedbacks.filter(f => f.status === 'PLANNED').length;
  const totalVotes = feedbacks.reduce((acc, f) => acc + (f.upvotes || 0), 0);
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '4.9';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header - Clean Light Theme */}
            <div className="bg-white border-b border-slate-200 p-4 sm:p-5 shrink-0 relative">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs shrink-0">
                    <TogoLionIcon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Amélioration & Retour d'Expérience
                      </h2>
                      <TogoFlag className="w-4 h-3 shrink-0 shadow-xs hidden sm:inline-block" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Votre avis fait évoluer la plateforme nationale Galenis Togo
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-tabs switch */}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => { setActiveSubTab('FORM'); setSubmittedSuccess(false); }}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'FORM'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Donner mon avis</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('LIST')}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'LIST'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Boîte à Idées</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-1 ${
                    activeSubTab === 'LIST' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {feedbacks.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab('ROADMAP')}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'ROADMAP'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Améliorations Déployées</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-1 ${
                    activeSubTab === 'ROADMAP' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {implementedCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              
              {/* TAB 1: FORMULAIRE DE RETOUR */}
              {activeSubTab === 'FORM' && (
                <div>
                  {submittedSuccess ? (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-emerald-200 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00A878] flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-slate-900">
                          Merci pour votre précieux retour !
                        </h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          Votre contribution a bien été enregistrée et ajoutée à la boîte à idées. Notre équipe l'étudiera pour les prochaines mises à jour.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setActiveSubTab('LIST')}
                          className="bg-[#00A878] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#009268] transition-all flex items-center gap-2"
                        >
                          <Lightbulb className="w-4 h-4" />
                          <span>Voir les idées de la communauté</span>
                        </button>
                        <button
                          onClick={() => setSubmittedSuccess(false)}
                          className="bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all"
                        >
                          Soumettre un autre retour
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Rating section */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          1. Votre évaluation globale de l'application
                        </label>
                        <div className="flex items-center gap-2 sm:gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 sm:p-1.5 focus:outline-none transition-transform hover:scale-115"
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                  (hoverRating || rating) >= star
                                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs sm:text-sm font-extrabold text-[#17324D] ml-2">
                            {rating}/5 étoiles
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {RATING_LABELS[hoverRating || rating]}
                        </p>
                      </div>

                      {/* Category selection */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          2. Nature de votre retour ou suggestion
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            const isSelected = category === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'border-[#00A878] bg-emerald-50/70 ring-2 ring-[#00A878]/20 text-[#17324D] font-bold'
                                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cat.color}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <span className="text-xs">{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Details Input */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          3. Votre proposition / commentaire
                        </label>
                        
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Titre court (ex: Ajout d'un filtre par quartier dans Lomé...)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A878] focus:border-transparent bg-slate-50/50"
                          />
                        </div>

                        <div>
                          <textarea
                            required
                            rows={3}
                            placeholder="Décrivez votre idée, le besoin ressenti ou le problème constaté en détail pour nous aider à l'adapter au mieux..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A878] focus:border-transparent bg-slate-50/50 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Votre Nom (Optionnel)</label>
                            <input
                              type="text"
                              placeholder="Ex: Kodjo K."
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A878]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Votre Profil</label>
                            <select
                              value={authorRole}
                              onChange={(e) => setAuthorRole(e.target.value as any)}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A878] bg-white font-medium"
                            >
                              <option value="CITOYEN">Citoyen / Usager</option>
                              <option value="PHARMACIEN">Pharmacien / Préparateur</option>
                              <option value="MEDECIN">Médecin / Soignant</option>
                              <option value="DEVELOPPEUR">Développeur / Tech</option>
                              <option value="AUTRE">Autre</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email ou N° WhatsApp (Optionnel)</label>
                            <input
                              type="text"
                              placeholder="Pour être informé de l'avancement"
                              value={emailOrPhone}
                              onChange={(e) => setEmailOrPhone(e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A878]"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!title.trim() || !description.trim()}
                        className="w-full bg-[#00A878] hover:bg-[#009268] text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        <span>Envoyer mon retour d'expérience</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: BOÎTE À IDÉES CITOYENNES */}
              {activeSubTab === 'LIST' && (
                <div className="space-y-4">
                  {/* Community Overview Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
                      <div className="text-xl font-black text-[#17324D]">{feedbacks.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Idées & Avis</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
                      <div className="text-xl font-black text-emerald-600">{avgRating}/5</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Note Moyenne</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
                      <div className="text-xl font-black text-blue-600">{plannedCount}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">En Développement</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
                      <div className="text-xl font-black text-teal-600">{implementedCount}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Déjà Déployées</div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rechercher une idée ou suggestion..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A878] bg-slate-50"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <button
                        onClick={() => setSelectedCategoryFilter('ALL')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                          selectedCategoryFilter === 'ALL'
                            ? 'bg-[#17324D] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Toutes ({feedbacks.length})
                      </button>
                      {CATEGORIES.map(cat => {
                        const count = feedbacks.filter(f => f.category === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryFilter(cat.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              selectedCategoryFilter === cat.id
                                ? 'bg-[#00A878] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat.label.split(' ')[0]} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedbacks Cards List */}
                  <div className="space-y-3">
                    {filteredFeedbacks.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                        <Lightbulb className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-sm">Aucune suggestion ne correspond à vos filtres</p>
                      </div>
                    ) : (
                      filteredFeedbacks.map((item) => {
                        const catConfig = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
                        const IconComponent = catConfig.icon;

                        const statusBadges: Record<AppFeedbackStatus, { label: string; bg: string; text: string }> = {
                          SUBMITTED: { label: 'Reçu', bg: 'bg-slate-100', text: 'text-slate-700' },
                          UNDER_REVIEW: { label: 'En cours d\'étude', bg: 'bg-amber-100', text: 'text-amber-800' },
                          PLANNED: { label: 'Prévu pour la v1.2', bg: 'bg-blue-100', text: 'text-blue-800' },
                          IMPLEMENTED: { label: 'Déployé dans l\'app', bg: 'bg-emerald-100', text: 'text-emerald-800' },
                          DECLINED: { label: 'Non retenu', bg: 'bg-rose-100', text: 'text-rose-800' },
                        };
                        const statusBadge = statusBadges[item.status] || statusBadges.SUBMITTED;

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-sm transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${catConfig.color}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                                      {item.title}
                                    </h4>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                                    <span className="font-bold text-slate-700">{item.authorName}</span>
                                    <span>•</span>
                                    <span>{item.authorRole}</span>
                                    <span>•</span>
                                    <span>{item.createdAt}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Upvote Button */}
                              <button
                                onClick={() => handleUpvote(item.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  item.userUpvoted
                                    ? 'bg-[#00A878] text-white border-[#00A878] shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${item.userUpvoted ? 'fill-white' : ''}`} />
                                <span>{item.upvotes}</span>
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                              {item.description}
                            </p>

                            {/* Official Admin Response if available */}
                            {item.adminResponse && (
                              <div className="bg-[#F4F8FA] rounded-xl p-3 border-l-3 border-[#00A878] text-xs space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-[#17324D]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A878]" />
                                  <span>{item.adminResponse.author}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">({item.adminResponse.respondedAt})</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                  {item.adminResponse.message}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ROADMAP & AMELIORATIONS DEPLOYEES */}
              {activeSubTab === 'ROADMAP' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-300" />
                      <h3 className="font-extrabold text-sm sm:text-base">
                        Améliorations guidées par vos retours
                      </h3>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                      Chaque mise à jour de Galenis Togo intègre les besoins réels exprimés par les citoyens, pharmaciens et développeurs du Togo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Implemented Features */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-black text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#00A878]" />
                        <span>Déjà Déployées dans l'application</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <strong className="text-slate-900 block font-bold">Retour de page & Historique de navigation</strong>
                          <span className="text-slate-600">Bouton de retour rapide en haut d'écran et synchronisation de l'historique de l'application.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <strong className="text-slate-900 block font-bold">Barre de navigation mobile ergonomique</strong>
                          <span className="text-slate-600">Accès rapide aux 5 fonctions majeures au bas de l'écran tactile.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <strong className="text-slate-900 block font-bold">Signalements & Vigilance citoyenne</strong>
                          <span className="text-slate-600">Avis sur les officines, signalement des fermetures inopinées en direct.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <strong className="text-slate-900 block font-bold">Calcul d'itinéraire GPS instantané</strong>
                          <span className="text-slate-600">Guidage routier direct depuis la fiche de chaque pharmacie.</span>
                        </div>
                      </div>
                    </div>

                    {/* Planned Features */}
                    <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-blue-800 font-black text-xs sm:text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>En cours de développement (v1.2)</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <strong className="text-slate-900 block font-bold">Consultation des gardes 100% hors-ligne</strong>
                          <span className="text-slate-600">Mise en cache automatique des gardes du weekend sans connexion internet.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <strong className="text-slate-900 block font-bold">Recherche vocale en Mina & Éwé</strong>
                          <span className="text-slate-600">Accessibilité renforcée pour la recherche de médicaments en langues locales.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <strong className="text-slate-900 block font-bold">Alerte SMS & WhatsApp de garde</strong>
                          <span className="text-slate-600">Réception hebdomadaire des pharmacies ouvertes dans son quartier.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
