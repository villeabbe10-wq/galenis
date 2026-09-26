import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveTab, Pharmacy, Drug, PharmacyDrugStock, Reservation, TAB_TITLES, UserSession, LegalSectionType } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from "./components/MobileBottomNav";
import { MobileSidebar } from "./components/MobileSidebar";
import { Footer } from './components/Footer';
import { NetworkStatusWidget } from './components/NetworkStatusWidget';
const CitizenView = lazy(() => import('./components/CitizenApp/CitizenView').then(module => ({ default: module.CitizenView })));
const DashboardView = lazy(() => import('./components/PharmacyDashboard/DashboardView').then(module => ({ default: module.DashboardView })));
const ApiPortalView = lazy(() => import('./components/ApiPortal/ApiPortalView').then(module => ({ default: module.ApiPortalView })));
const PartnerNetworkView = lazy(() => import('./components/PartnerNetwork/PartnerNetworkView').then(module => ({ default: module.PartnerNetworkView })));
const StrategyView = lazy(() => import('./components/StrategyRoadmap/StrategyView').then(module => ({ default: module.StrategyView })));
const CoverageView = lazy(() => import('./components/CoverageView').then(module => ({ default: module.CoverageView })));
const PricingView = lazy(() => import('./components/PricingView').then(module => ({ default: module.PricingView })));
const ResourcesView = lazy(() => import('./components/ResourcesView').then(module => ({ default: module.ResourcesView })));
const ContactsView = lazy(() => import('./components/ContactsView').then(module => ({ default: module.ContactsView })));
import { PRESET_USERS } from './components/AuthPortalView';
const AuthPortalView = lazy(() => import('./components/AuthPortalView').then(module => ({ default: module.AuthPortalView })));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView').then(module => ({ default: module.AdminDashboardView })));
const CommunityVigilanceView = lazy(() => import('./components/CommunityVigilance/CommunityVigilanceView').then(module => ({ default: module.CommunityVigilanceView })));
const AccountProfileView = lazy(() => import('./components/AccountProfile/AccountProfileView').then(module => ({ default: module.AccountProfileView })));
const AiPrivacyGatewayView = lazy(() => import('./components/AiPrivacyGateway/AiPrivacyGatewayView').then(module => ({ default: module.AiPrivacyGatewayView })));
const LegalSpaceView = lazy(() => import('./components/LegalPages/LegalSpaceView').then(module => ({ default: module.LegalSpaceView })));
import { TogoHeritageGallery } from './components/TogoHeritageGallery';
import { AppFeedbackModal } from './components/AppFeedback/AppFeedbackModal';
import { DashboardFaqModal, FaqAudience } from './components/common/DashboardFaqModal';
import { GuardNotificationModal } from './components/Notifications/GuardNotificationModal';
import { InAppPushBanner } from './components/Notifications/InAppPushBanner';
import { ProtectedAuthGate } from './components/common/ProtectedAuthGate';
import { PharmacyUiverseLoader } from './components/common/PharmacyUiverseLoader';
import { TogoLionIcon } from './components/TogoEmblems';
import { initNativeMobileBridge } from './utils/mobileNative';
import { 
  getPharmacies, 
  getDrugs, 
  getDrugStocks, 
  getReservations, 
  initStorage,
  syncPharmacyDirectory,
  initRealtimeCloudSync
} from './services/pharmacyStorage';

export default function App() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTabState] = useState<ActiveTab>('CITIZEN');
  const [navigationHistory, setNavigationHistory] = useState<ActiveTab[]>(['CITIZEN']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'DATA_ADMIN'>('SUPER_ADMIN');

  // Authenticated user session state (defaults to null for public visitors, or restored from localStorage)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('galenis_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const handleSetSession = useCallback((session: UserSession | null) => {
    setCurrentUser(session);
    try {
      if (session) {
        localStorage.setItem('galenis_user_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('galenis_user_session');
      }
    } catch {
      // ignore storage error
    }
  }, []);

  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackModalTab, setFeedbackModalTab] = useState<'FORM' | 'LIST' | 'ROADMAP'>('FORM');

  // Dedicated Legal Section state
  const [legalSection, setLegalSection] = useState<LegalSectionType>('TERMS');

  // Real-time Guard Push Notifications Modal State
  const [isGuardNotifModalOpen, setIsGuardNotifModalOpen] = useState(false);

  // Interactive Strict Role-Restricted FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqAudience, setFaqAudience] = useState<FaqAudience>('CITIZEN');

  const handleOpenFaq = (requestedAudience?: FaqAudience) => {
    // Strictly isolate FAQ: a user has no access to another role's FAQ
    let authorizedAudience: FaqAudience = 'CITIZEN';
    if (currentUser) {
      if (currentUser.role === 'PHARMACIEN') {
        authorizedAudience = 'PHARMACY';
      } else if (currentUser.role === 'DEVELOPPEUR') {
        authorizedAudience = 'DEVELOPER';
      } else if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DATA_ADMIN') {
        authorizedAudience = 'ADMIN';
      } else {
        authorizedAudience = 'CITIZEN';
      }
    } else {
      if (requestedAudience === 'DEVELOPER' && activeTab === 'API_PORTAL') {
        authorizedAudience = 'DEVELOPER';
      } else {
        authorizedAudience = 'CITIZEN';
      }
    }
    setFaqAudience(authorizedAudience);
    setIsFaqModalOpen(true);
  };

  // State loaded from pharmacyStorage
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [stocks, setStocks] = useState<PharmacyDrugStock[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Function to reload data when updates occur in Pharmacy Dashboard
  const loadData = () => {
    initStorage();
    setPharmacies(getPharmacies());
    setDrugs(getDrugs());
    setStocks(getDrugStocks());
    setReservations(getReservations());
  };

  // History and Navigation Handler
  const navigateToTab = useCallback((nextTab: ActiveTab, replace = false) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (nextTab === activeTab && !replace) return;

    if (replace) {
      setNavigationHistory(prev => {
        const next = [...prev];
        next[historyIndex] = nextTab;
        return next;
      });
      setActiveTabState(nextTab);
    } else {
      setNavigationHistory(prev => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, nextTab];
      });
      setHistoryIndex(prev => prev + 1);
      setActiveTabState(nextTab);
    }
  }, [activeTab, historyIndex]);

  // Logout handler
  const handleLogout = useCallback(() => {
    handleSetSession(null);
    navigateToTab('CITIZEN');
  }, [handleSetSession, navigateToTab]);

  // Open Legal section handler
  const handleOpenLegal = useCallback((section: LegalSectionType = 'TERMS') => {
    setLegalSection(section);
    navigateToTab('LEGAL_TERMS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateToTab]);

  // Go Back Handler
  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const prevIndex = historyIndex - 1;
      const targetTab = navigationHistory[prevIndex];
      setHistoryIndex(prevIndex);
      setActiveTabState(targetTab);
    }
  }, [historyIndex, navigationHistory]);

  useEffect(() => {
    loadData();
    syncPharmacyDirectory();
    const unsubscribeCloud = initRealtimeCloudSync(loadData);

    const handleSync = () => {
      loadData();
    };
    window.addEventListener('pharmacy-directory-synced', handleSync);

    const handlePwaInstall = () => {
      console.log("PWA Installed");
    };
    window.addEventListener('appinstalled', handlePwaInstall);

    initNativeMobileBridge(() => {
      if (isFeedbackModalOpen) {
        setIsFeedbackModalOpen(false);
        return true;
      }
      if (isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
        return true;
      }
      if (historyIndex > 0) {
        goBack();
        return true;
      }
      return false;
    });

    return () => {
      unsubscribeCloud();
      window.removeEventListener('pharmacy-directory-synced', handleSync);
      window.removeEventListener('appinstalled', handlePwaInstall);
    };
  }, [historyIndex, goBack, isFeedbackModalOpen, isMobileDrawerOpen]);

  const canGoBack = historyIndex > 0;
  const previousTab = canGoBack ? navigationHistory[historyIndex - 1] : undefined;
  const previousTabTitle = previousTab ? TAB_TITLES[previousTab] : undefined;

  const handleOpenFeedback = (tab: 'FORM' | 'LIST' | 'ROADMAP' = 'FORM') => {
    setFeedbackModalTab(tab);
    setIsFeedbackModalOpen(true);
  };

  const deGardeCount = pharmacies.filter(p => p.status === 'DE_GARDE' || p.isGuardToday).length;

  return (
    <div className="min-h-screen pb-16 sm:pb-0 bg-[#F4F8FA] text-[#17324D] font-sans flex flex-col selection:bg-[#00A878] selection:text-white overflow-x-hidden w-full relative">
      {/* Global Application Header with User Session Context */}
      <Header
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        deGardeCount={deGardeCount}
        totalPharmacies={pharmacies.length}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        canGoBack={canGoBack}
        goBack={goBack}
        previousTabTitle={previousTabTitle}
        onOpenFeedback={handleOpenFeedback}
        onOpenFaq={handleOpenFaq}
        onOpenGuardNotifications={() => setIsGuardNotifModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Real-time Local In-App Push Banner */}
      <InAppPushBanner 
        onSelectPharmacy={(pharmacy) => {
          navigateToTab('CITIZEN');
        }} 
      />

      {/* Main Container View Area */}
      <main className="relative z-0 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <PharmacyUiverseLoader 
                  size="lg"
                  theme="emerald"
                  label="Chargement de l'application & des pharmacies..."
                  subLabel="Cadastre Officiel DPML / Ordre National des Pharmaciens du Togo"
                />
              </div>
            }>
            {activeTab === 'CITIZEN' && (
              <CitizenView
                pharmacies={pharmacies}
                drugs={drugs}
                stocks={stocks}
                currentUser={currentUser}
                onOpenPharmacyDashboard={() => navigateToTab('PHARMACY_DASHBOARD')}
                onOpenCommunityVigilance={() => navigateToTab('COMMUNITY_VIGILANCE')}
                onOpenAiAssistant={() => navigateToTab('AI_PRIVACY_GATEWAY')}
              />
            )}

            {activeTab === 'COMMUNITY_VIGILANCE' && (
              <CommunityVigilanceView 
                pharmacies={pharmacies}
                onOpenPharmacy={() => navigateToTab('CITIZEN')}
              />
            )}

            {activeTab === 'PHARMACY_DASHBOARD' && (
              (!currentUser || (currentUser.role !== 'PHARMACIEN' && currentUser.role !== 'SUPER_ADMIN')) ? (
                <ProtectedAuthGate
                  requiredRoles={['PHARMACIEN', 'SUPER_ADMIN']}
                  spaceName="Espace Officine & Gestion Pharmacie"
                  spaceDescription="Déclaration des gardes officielles ONPT, gestion des stocks de médicaments critiques et validation des ordonnances."
                  currentUser={currentUser}
                  onLoginAsPreset={(session) => {
                    handleSetSession(session);
                    loadData();
                  }}
                  onNavigateToLogin={() => navigateToTab('LOGIN')}
                  onCancel={() => navigateToTab('CITIZEN')}
                />
              ) : (
                <DashboardView
                  pharmacies={pharmacies}
                  drugs={drugs}
                  stocks={stocks}
                  reservations={reservations}
                  onRefreshData={loadData}
                  currentUser={currentUser}
                  onNavigateToLogin={() => navigateToTab('LOGIN')}
                  onSetCurrentUser={handleSetSession}
                  onOpenFaq={() => handleOpenFaq('PHARMACY')}
                />
              )
            )}

            {activeTab === 'COVERAGE' && (
              <CoverageView pharmacies={pharmacies} />
            )}

            {activeTab === 'PRICING' && (
              <PricingView onNavigateToApiPortal={() => navigateToTab('API_PORTAL')} />
            )}

            {activeTab === 'API_PORTAL' && (
              <ApiPortalView onOpenFaq={() => handleOpenFaq('DEVELOPER')} />
            )}

            {activeTab === 'AI_PRIVACY_GATEWAY' && (
              (!currentUser) ? (
                <ProtectedAuthGate
                  requiredRoles={['CITOYEN', 'PHARMACIEN', 'SUPER_ADMIN', 'DATA_ADMIN', 'DEVELOPPEUR']}
                  spaceName="Assistant Santé Intelligent Galenis"
                  spaceDescription="Pour accéder à l'assistant médical intelligent, analyser vos ordonnances et obtenir des conseils thérapeutiques sécurisés, veuillez vous connecter à votre compte citoyen ou professionnel."
                  currentUser={currentUser}
                  onLoginAsPreset={(session) => {
                    handleSetSession(session);
                  }}
                  onNavigateToLogin={() => navigateToTab('LOGIN')}
                  onCancel={() => navigateToTab('CITIZEN')}
                />
              ) : (
                <AiPrivacyGatewayView />
              )
            )}

            {activeTab === 'RESOURCES' && (
              <ResourcesView />
            )}

            {activeTab === 'CONTACTS' && (
              <ContactsView />
            )}

            {activeTab === 'PARTNER_NETWORK' && (
              <PartnerNetworkView pharmacies={pharmacies} />
            )}

            {activeTab === 'ROADMAP_STRATEGY' && (
              <StrategyView />
            )}
            
            {activeTab === 'LOGIN' && (
              <AuthPortalView 
                onLoginSuccess={(session) => {
                  handleSetSession(session);
                  if (session.role === 'PHARMACIEN') {
                    navigateToTab('PHARMACY_DASHBOARD');
                  } else if (session.role === 'DEVELOPPEUR') {
                    navigateToTab('API_PORTAL');
                  } else if (session.role === 'CITOYEN') {
                    navigateToTab('USER_PROFILE');
                  } else if (session.role === 'SUPER_ADMIN' || session.role === 'DATA_ADMIN') {
                    setAdminRole(session.role as 'SUPER_ADMIN' | 'DATA_ADMIN');
                    navigateToTab('ADMIN_DASHBOARD');
                  }
                }} 
                onOpenFaq={() => handleOpenFaq('PHARMACY')}
              />
            )}

            {activeTab === 'ADMIN_DASHBOARD' && (
              (!currentUser || (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'DATA_ADMIN')) ? (
                <ProtectedAuthGate
                  requiredRoles={['SUPER_ADMIN', 'DATA_ADMIN']}
                  spaceName="Supervision Nationale & Administration Centrale"
                  spaceDescription="Homologation des officines, validation des intégrateurs d'APIs, audit des requêtes et alertes sanitaires nationales."
                  currentUser={currentUser}
                  onLoginAsPreset={(session) => {
                    handleSetSession(session);
                    setAdminRole(session.role as 'SUPER_ADMIN' | 'DATA_ADMIN');
                    loadData();
                  }}
                  onNavigateToLogin={() => navigateToTab('LOGIN')}
                  onCancel={() => navigateToTab('CITIZEN')}
                />
              ) : (
                <AdminDashboardView 
                  role={adminRole} 
                  onLogout={handleLogout} 
                  onRefreshData={loadData}
                  onOpenFaq={() => handleOpenFaq('ADMIN')}
                />
              )
            )}

            {activeTab === 'USER_PROFILE' && (
              (!currentUser) ? (
                <ProtectedAuthGate
                  requiredRoles={['PHARMACIEN', 'DEVELOPPEUR', 'CITOYEN', 'SUPER_ADMIN']}
                  spaceName="Espace Profil & Paramètres Sécurisés"
                  spaceDescription="Accès confidentiel à vos données certifiées, attestations professionnelles et historique de sécurité."
                  currentUser={currentUser}
                  onLoginAsPreset={(session) => {
                    handleSetSession(session);
                  }}
                  onNavigateToLogin={() => navigateToTab('LOGIN')}
                  onCancel={() => navigateToTab('CITIZEN')}
                />
              ) : (
                <AccountProfileView
                  currentUser={currentUser}
                  currentRole={currentUser?.role || 'PHARMACIEN'}
                  pharmacies={pharmacies}
                  drugs={drugs}
                  stocks={stocks}
                  onNavigateToDashboard={() => navigateToTab('PHARMACY_DASHBOARD')}
                  onNavigateToCitizen={() => navigateToTab('CITIZEN')}
                  onNavigateToApiPortal={() => navigateToTab('API_PORTAL')}
                  onLogout={handleLogout}
                  onSwitchAccount={() => navigateToTab('LOGIN')}
                />
              )
            )}

            {activeTab === 'LEGAL_TERMS' && (
              <LegalSpaceView 
                initialSection={legalSection} 
                onNavigateToTab={navigateToTab} 
                onOpenFeedback={() => handleOpenFeedback('FORM')}
              />
            )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Togo Heritage Animated Gallery */}
      <TogoHeritageGallery />

      {/* Footer */}
      <Footer 
        activeTab={activeTab} 
        setActiveTab={navigateToTab} 
        onOpenFeedback={handleOpenFeedback}
        onOpenLegal={handleOpenLegal}
      />

      {/* Mobile Navigation Bars */}
      <MobileBottomNav 
        activeTab={activeTab} 
        setActiveTab={navigateToTab} 
        currentUser={currentUser}
      />

      <MobileSidebar 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={navigateToTab} 
        canGoBack={canGoBack}
        goBack={goBack}
        previousTabTitle={previousTabTitle}
        onOpenFeedback={handleOpenFeedback}
        onOpenFaq={handleOpenFaq}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Network & Persistence Status Widget (appears only when offline) */}
      <NetworkStatusWidget onDataReload={loadData} />

      {/* Unified Floating Action Dock (Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
        {/* Avis & Idées (Lion Emblem of Togo) */}
        <button
          onClick={() => handleOpenFeedback('FORM')}
          className="pointer-events-auto group flex items-center gap-2 bg-white hover:bg-emerald-50/80 text-slate-800 hover:text-emerald-700 px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg border border-slate-200 hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          title="Donner votre retour d'expérience ou proposer une idée (Lion du Togo)"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
            <TogoLionIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1 hidden xs:inline sm:inline">
            Avis & Idées
          </span>
        </button>
      </div>

      {/* Real-time Push Guard Notifications Center Modal */}
      <GuardNotificationModal
        isOpen={isGuardNotifModalOpen}
        onClose={() => setIsGuardNotifModalOpen(false)}
        onSelectPharmacy={(pharmacy) => {
          navigateToTab('CITIZEN');
        }}
      />

      {/* Global App Feedback & Suggestions Modal */}
      <AppFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        initialTab={feedbackModalTab}
      />

      {/* Dynamic Audience-Aware FAQ & Principles Guide Modal */}
      <DashboardFaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        initialAudience={faqAudience}
        onNavigateToTab={navigateToTab}
      />
    </div>
  );
}

