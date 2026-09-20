import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActiveTab, UserSession } from '../types';
import { TogoFlag, TogoLionIcon } from './TogoEmblems';
import { GalenisLogo } from './GalenisLogo';
import { TraceabilityContextBand } from './TraceabilityContextBand';
import headerBgImage from '../assets/images/pharmacy_header_banner_1787408881227.jpg';
import { PWAInstallButton } from './PWA/PWAInstallButton';
import { 
  Building2, 
  Code2, 
  Compass, 
  Smartphone, 
  Activity,
  ShieldCheck,
  Globe2,
  Scale,
  BookOpen,
  PhoneCall,
  Lock,
  Menu,
  ChevronDown,
  ArrowLeft,
  User,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  deGardeCount: number;
  totalPharmacies: number;
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (isOpen: boolean) => void;
  canGoBack?: boolean;
  goBack?: () => void;
  previousTabTitle?: string;
  onOpenFeedback?: (initialTab?: 'FORM' | 'LIST' | 'ROADMAP') => void;
  onOpenFaq?: (audience?: 'PHARMACY' | 'DEVELOPER' | 'ADMIN' | 'CITIZEN') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  deGardeCount,
  totalPharmacies,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  canGoBack,
  goBack,
  previousTabTitle,
  onOpenFeedback,
  onOpenFaq
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'CITIZEN', label: 'Citoyen & Gardes', icon: Smartphone },
    { id: 'COVERAGE', label: 'Couverture', icon: Globe2 },
    { id: 'PRICING', label: 'Tarifs', icon: Scale },
    { id: 'RESOURCES', label: 'Ressources', icon: BookOpen },
    { id: 'PARTNER_NETWORK', label: 'Réseau Partenaires', icon: ShieldCheck },
    { id: 'CONTACTS', label: 'Contacts', icon: PhoneCall },
    { id: 'ROADMAP_STRATEGY', label: 'Vision & Stratégie', icon: Compass },
  ];

  return (
    <header className="relative z-50 bg-white/90 backdrop-blur-xl text-[#17324D] border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      {/* Contextual Medical / Pharmacy Background with rich authentic lighting & overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 md:opacity-25 transition-opacity duration-300"
          style={{ backgroundImage: `url(${headerBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-[#F4F8FA]/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Top Banner Notice with soft glass styling */}
        <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200/70 text-slate-700 px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] md:text-xs font-semibold flex flex-wrap items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <TogoFlag className="w-3.5 h-2.5 sm:w-4 sm:h-3 shrink-0 shadow-xs rounded-[2px]" />
            <span className="truncate">
              <strong className="text-slate-900 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">RÉPUBLIQUE TOGOLAISE :</strong>{" "}
              <span className="hidden sm:inline font-medium text-slate-600">Référentiel national officiel des pharmacies</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 text-slate-600 text-[10px] sm:text-[11px] md:text-xs font-medium shrink-0">
            <span><strong className="text-slate-900 font-extrabold">{totalPharmacies}</strong> <span className="hidden sm:inline text-slate-500">Pharmacies</span></span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold text-[10px] border border-emerald-300/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{deGardeCount} De Garde</span>
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-slate-500 font-medium">Ministère de la Santé</span>
            
            {/* Quick Feedback Button in Top Bar */}
            {onOpenFeedback && (
              <button
                onClick={() => onOpenFeedback('FORM')}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-emerald-700 font-bold bg-white hover:bg-emerald-50/50 border border-slate-200/80 px-2.5 py-0.5 rounded-full transition-all shadow-2xs ml-1 cursor-pointer"
                title="Donner votre avis ou suggérer une amélioration sur l'application (Lion du Togo)"
              >
                <TogoLionIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Améliorer l'app</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Brand Header Zone (GetLayers Inspired: Clean, High Contrast, Bento Card Spacing) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-3.5 md:py-4 flex flex-row items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          {/* Logo & Slogan & Mobile Back Navigation - Far Left */}
          <div className="flex items-center shrink-0 min-w-0 gap-2 sm:gap-3">
            <button 
              onClick={() => setIsMobileDrawerOpen && setIsMobileDrawerOpen(true)} 
              className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100/80 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200" 
              title="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Back Button */}
            {canGoBack && goBack && (
              <button
                onClick={goBack}
                className="sm:hidden p-1.5 text-emerald-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                title={previousTabTitle ? `Retour à ${previousTabTitle}` : 'Retour à la page précédente'}
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[10px] font-extrabold hidden xs:inline">Retour</span>
              </button>
            )}

            <GalenisLogo variant="full" lightMode={true} className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 drop-shadow-xs" />
          </div>

          {/* Emergency Guard Bento badge & Feedback action - Far Right */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton variant="compact" />

            {/* Feedback Button for Desktop / Tablet */}
            {onOpenFeedback && (
              <button
                onClick={() => onOpenFeedback('FORM')}
                className="hidden lg:flex items-center gap-2 bg-white/90 hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300/80 rounded-2xl px-3.5 py-2 text-xs font-extrabold shadow-2xs transition-all cursor-pointer group"
              >
                <TogoLionIcon className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Donner mon avis</span>
              </button>
            )}

            {/* Glass Bento Badge for Emergency Guard */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-emerald-300/80 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 text-slate-900 shadow-2xs transition-all">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-xs text-white">
                <Activity className="w-4 h-4 stroke-[2.5] animate-pulse" />
              </span>
              <div>
                <div className="hidden sm:block text-[9px] sm:text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none mb-0.5">Urgence Garde</div>
                <div className="font-extrabold text-slate-900 text-[11px] sm:text-xs md:text-sm leading-tight whitespace-nowrap font-display">
                  <span className="hidden sm:inline">Aujourd'hui : </span>
                  <span className="text-emerald-700 font-black">{deGardeCount} <span className="hidden sm:inline text-slate-700 font-bold">Pharmacies</span><span className="sm:hidden"> Garde</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 Signature Contextual Band: Abstract Medical Linework & Chaîne de Traçabilité */}
        <TraceabilityContextBand />

        {/* Navigation Tabs Bar - STICKY TOP-0 (GetLayers Floating Dock Style) */}
        <div className="hidden sm:block sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-t border-b border-slate-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between">
            
            {/* Nav Tabs Pill Row */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-[11px] sm:text-xs font-bold hide-scrollbar min-w-0">
              <nav className="flex items-center gap-1 min-w-0 p-0.5 bg-slate-100/70 rounded-2xl border border-slate-200/60">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none font-bold text-xs ${
                        isActive
                          ? 'text-white font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeHeaderTab"
                          className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl shadow-xs"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <Icon className={`relative z-10 w-3.5 h-3.5 stroke-[2.2] ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="w-px h-6 bg-slate-200/80 mx-2 hidden sm:block"></div>

            {/* Quick FAQ & Guide Button */}
            {onOpenFaq && (
              <button
                type="button"
                onClick={() => {
                  if (currentUser?.role === 'PHARMACIEN') onOpenFaq('PHARMACY');
                  else if (currentUser?.role === 'DEVELOPPEUR') onOpenFaq('DEVELOPER');
                  else if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'DATA_ADMIN') onOpenFaq('ADMIN');
                  else onOpenFaq('CITIZEN');
                }}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300 text-xs font-extrabold transition-all shadow-2xs cursor-pointer mr-1.5"
                title="Consulter le guide officiel et FAQ de votre espace"
              >
                <TogoLionIcon className="w-4 h-4 text-emerald-600" />
                <span>Guide & FAQ</span>
              </button>
            )}

            {/* Authenticated User Session Pill / Login */}
            <div className="relative shrink-0 py-1.5 pl-1" ref={menuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all cursor-pointer border ${
                    ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white border-emerald-600 shadow-xs'
                      : 'bg-white/90 hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs'
                  }`}
                  title={`Connecté en tant que ${currentUser.name}`}
                >
                  <div className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shadow-xs shrink-0 ${
                    ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {currentUser.avatarInitials || currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className={`text-xs font-black truncate max-w-[130px] leading-tight font-display ${
                      ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                        ? 'text-white'
                        : 'text-slate-900'
                    }`}>
                      {currentUser.name}
                    </div>
                    <div className={`text-[10px] font-bold leading-none mt-0.5 flex items-center gap-1 ${
                      ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                        ? 'text-emerald-100'
                        : 'text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                          ? 'bg-white animate-pulse'
                          : 'bg-emerald-600 animate-pulse'
                      }`} />
                      <span>
                        {currentUser.role === 'PHARMACIEN' && 'Pharmacien ONPT'}
                        {currentUser.role === 'DEVELOPPEUR' && 'Développeur API'}
                        {currentUser.role === 'CITOYEN' && 'Assuré INAM'}
                        {currentUser.role === 'SUPER_ADMIN' && 'Super Admin'}
                        {currentUser.role === 'DATA_ADMIN' && 'Administrateur Données'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                    ['USER_PROFILE', 'PHARMACY_DASHBOARD', 'API_PORTAL', 'ADMIN_DASHBOARD'].includes(activeTab)
                      ? 'text-white'
                      : 'text-slate-500'
                  } ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('LOGIN')}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-xs transition-all transform-gpu hover:-translate-y-0.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Connexion Pro / API</span>
                </button>
              )}

              {/* Authenticated Dropdown Menu */}
              {isMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header Card */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 text-slate-900 border-b border-emerald-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                          {currentUser.avatarInitials || currentUser.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 truncate font-display">{currentUser.name}</div>
                          <div className="text-[11px] text-slate-600 truncate">{currentUser.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 font-extrabold text-[10px]">
                        {currentUser.badge || (currentUser.role === 'PHARMACIEN' ? 'ONPT Certifié' : 'API Certifié')}
                      </span>
                      <span className="text-slate-500 font-medium text-[10px] truncate max-w-[120px]">
                        {currentUser.organization || 'Galenis Togo'}
                      </span>
                    </div>
                  </div>

                  {/* Role Specific Actions */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { setActiveTab('USER_PROFILE'); setIsMenuOpen(false); }}
                      className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                        activeTab === 'USER_PROFILE' ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900">
                          {currentUser.role === 'PHARMACIEN' && 'Mon Profil & Agrément ONPT'}
                          {currentUser.role === 'DEVELOPPEUR' && 'Mon Profil Développeur & Clés API'}
                          {currentUser.role === 'CITOYEN' && 'Mon Espace Santé & Profil'}
                          {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') && 'Mon Compte Administrateur'}
                        </div>
                        <div className="text-[10px] text-slate-500">Informations, paramètres & sécurité</div>
                      </div>
                    </button>

                    {currentUser.role === 'PHARMACIEN' && (
                      <button
                        onClick={() => { setActiveTab('PHARMACY_DASHBOARD'); setIsMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                          activeTab === 'PHARMACY_DASHBOARD' ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900">Tableau de bord Officine</div>
                          <div className="text-[10px] text-slate-500">Gestion des stocks, gardes & INAM</div>
                        </div>
                      </button>
                    )}

                    {currentUser.role === 'DEVELOPPEUR' && (
                      <button
                        onClick={() => { setActiveTab('API_PORTAL'); setIsMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                          activeTab === 'API_PORTAL' ? 'bg-blue-50 text-blue-900 font-extrabold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900">Portail API Public & Docs</div>
                          <div className="text-[10px] text-slate-500">Documentation Swagger, tarifs & SDKs</div>
                        </div>
                      </button>
                    )}

                    {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') && (
                      <button
                        onClick={() => { setActiveTab('ADMIN_DASHBOARD'); setIsMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                          activeTab === 'ADMIN_DASHBOARD' ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900">Supervision Nationale</div>
                          <div className="text-[10px] text-slate-500">Audit des officines & registres</div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Account Actions & Logout */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/80 space-y-1">
                    {onOpenFaq && (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentUser.role === 'PHARMACIEN') onOpenFaq('PHARMACY');
                          else if (currentUser.role === 'DEVELOPPEUR') onOpenFaq('DEVELOPER');
                          else if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') onOpenFaq('ADMIN');
                          else onOpenFaq('CITIZEN');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <TogoLionIcon className="w-4 h-4 text-emerald-600" />
                          <span>Guide & FAQ de mon espace</span>
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => { setActiveTab('LOGIN'); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Changer de compte</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Se déconnecter</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};



