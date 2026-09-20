import React from 'react';
import { ActiveTab, UserSession } from '../types';
import { 
  Globe2, 
  Scale, 
  BookOpen, 
  Compass, 
  Code2, 
  AlertTriangle, 
  ShieldAlert, 
  Settings, 
  X,
  ArrowLeft,
  MessageSquareHeart,
  ChevronRight,
  User,
  LogOut,
  Building2,
  Lock,
  ShieldCheck,
  Shield,
  HelpCircle
} from 'lucide-react';
import { GalenisLogo } from './GalenisLogo';
import { TogoLionIcon } from './TogoEmblems';
import { PWAInstallButton } from './PWA/PWAInstallButton';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canGoBack?: boolean;
  goBack?: () => void;
  previousTabTitle?: string;
  onOpenFeedback?: (initialTab?: 'FORM' | 'LIST' | 'ROADMAP') => void;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  onOpenFaq?: (audience?: any) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab,
  canGoBack,
  goBack,
  previousTabTitle,
  onOpenFeedback,
  currentUser,
  onLogout,
  onOpenFaq
}) => {
  const handleNav = (tab: ActiveTab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab(tab);
    onClose();
  };

  const handleOpenFeedback = (tab: 'FORM' | 'LIST' | 'ROADMAP' = 'FORM') => {
    onClose();
    if (onOpenFeedback) {
      onOpenFeedback(tab);
    }
  };

  const handleBack = () => {
    if (goBack) {
      goBack();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] sm:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-[101] shadow-2xl flex flex-col sm:hidden overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <GalenisLogo variant="icon" className="w-8 h-8" />
                <span className="font-extrabold text-slate-900 text-lg">Menu Navigation</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer"
                title="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PWA Mobile Quick Install Banner */}
            <PWAInstallButton variant="banner" />

            {/* Authenticated User Session Card in Drawer - Light Medical Theme */}
            {currentUser ? (
              <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 text-slate-900 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border border-emerald-400 shrink-0">
                      {currentUser.avatarInitials || currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-emerald-800 font-bold truncate">
                        {currentUser.role === 'PHARMACIEN' && 'Pharmacien Titulaire'}
                        {currentUser.role === 'DEVELOPPEUR' && 'Développeur Partenaire'}
                        {currentUser.role === 'CITOYEN' && 'Assuré Santé Citoyen'}
                        {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') && 'Administrateur National'}
                      </div>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => { onLogout(); onClose(); }}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 text-xs cursor-pointer"
                      title="Déconnexion"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                    </button>
                  )}
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-emerald-200/80">
                  <button
                    onClick={() => handleNav('USER_PROFILE')}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 text-[11px] font-bold cursor-pointer"
                  >
                    <User className="w-3 h-3 text-emerald-600" />
                    <span>Mon Profil</span>
                  </button>
                  {currentUser.role === 'PHARMACIEN' && (
                    <button
                      onClick={() => handleNav('PHARMACY_DASHBOARD')}
                      className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#00A878] hover:bg-emerald-600 text-white text-[11px] font-black cursor-pointer shadow-2xs"
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Tableau de bord</span>
                    </button>
                  )}
                  {currentUser.role === 'DEVELOPPEUR' && (
                    <button
                      onClick={() => handleNav('API_PORTAL')}
                      className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black cursor-pointer"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>Portail API</span>
                    </button>
                  )}
                  {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') && (
                    <button
                      onClick={() => handleNav('ADMIN_DASHBOARD')}
                      className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black cursor-pointer"
                    >
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span>Gouvernance</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-100 border-b border-slate-200">
                <button
                  onClick={() => handleNav('LOGIN')}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Connexion Espace Professionnel</span>
                </button>
              </div>
            )}

            {/* Back to previous page action (if history exists) */}
            {canGoBack && goBack && (
              <div className="p-3 bg-emerald-50/70 border-b border-emerald-100">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl bg-white border border-[#00A878]/30 text-[#17324D] shadow-xs hover:bg-emerald-50 transition-all font-bold text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#00A878] text-white flex items-center justify-center">
                      <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Page précédente</div>
                      <div className="text-xs font-black text-slate-900 truncate max-w-[180px]">
                        {previousTabTitle || 'Retour'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              
              {/* Highlight: Feedback & Suggestions System */}
              {onOpenFeedback && (
                <div className="mb-2 p-1">
                  <button
                    onClick={() => handleOpenFeedback('FORM')}
                    className="flex items-center justify-between w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 text-slate-900 shadow-xs hover:bg-emerald-100/70 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <TogoLionIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Vos Retours & Idées</div>
                        <div className="text-[10px] text-emerald-700 font-medium">Faites évoluer l'application</div>
                      </div>
                    </div>
                    <span className="bg-emerald-600/10 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                      Avis
                    </span>
                  </button>
                </div>
              )}

              <button
                onClick={() => handleNav('COMMUNITY_VIGILANCE')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'COMMUNITY_VIGILANCE'
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 ${activeTab === 'COMMUNITY_VIGILANCE' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Signalements & Alertes</span>
              </button>

              <button
                onClick={() => handleNav('COVERAGE')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'COVERAGE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Globe2 className={`w-5 h-5 ${activeTab === 'COVERAGE' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Couverture Sanitaire</span>
              </button>

              <button
                onClick={() => handleNav('PRICING')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'PRICING'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Scale className={`w-5 h-5 ${activeTab === 'PRICING' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Tarifs & Modèles</span>
              </button>

              <button
                onClick={() => handleNav('API_PORTAL')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'API_PORTAL'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Code2 className={`w-5 h-5 ${activeTab === 'API_PORTAL' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Intégrations API</span>
              </button>

              <button
                onClick={() => handleNav('RESOURCES')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'RESOURCES'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className={`w-5 h-5 ${activeTab === 'RESOURCES' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Ressources & Guides</span>
              </button>

              {onOpenFaq && (
                <button
                  onClick={() => {
                    onClose();
                    if (currentUser?.role === 'PHARMACIEN') onOpenFaq('PHARMACY');
                    else if (currentUser?.role === 'DEVELOPPEUR') onOpenFaq('DEVELOPER');
                    else if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'DATA_ADMIN') onOpenFaq('ADMIN');
                    else onOpenFaq('CITIZEN');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                >
                  <TogoLionIcon className="w-5 h-5 text-emerald-600" />
                  <span>Guide & FAQ Officiels</span>
                </button>
              )}

              <button
                onClick={() => handleNav('PARTNER_NETWORK')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'PARTNER_NETWORK'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${activeTab === 'PARTNER_NETWORK' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Réseau Partenaires</span>
              </button>

              <button
                onClick={() => handleNav('ROADMAP_STRATEGY')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'ROADMAP_STRATEGY'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Compass className={`w-5 h-5 ${activeTab === 'ROADMAP_STRATEGY' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Vision & Stratégie</span>
              </button>

              <button
                onClick={() => handleNav('LEGAL_TERMS')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'LEGAL_TERMS'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Scale className={`w-5 h-5 ${activeTab === 'LEGAL_TERMS' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Cadre Légal & Vie Privée</span>
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 pb-safe">
              <p className="text-[10px] text-slate-500 font-medium text-center">
                © 2026 Galenis Togo • République Togolaise
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
