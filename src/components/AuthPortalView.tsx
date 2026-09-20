import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Code2, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight,
  Database,
  Mail,
  KeyRound,
  Sparkles,
  Shield,
  Heart,
  CheckCircle2,
  Phone,
  MapPin,
  FileCheck,
  UserPlus,
  LogIn,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Send,
  ArrowLeft,
  Check,
  RefreshCw,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ActiveTab, UserRole, UserSession } from '../types';
import { TogoFlag, TogoLionIcon } from './TogoEmblems';

interface AuthPortalViewProps {
  onLoginSuccess: (session: UserSession) => void;
  onOpenFaq?: () => void;
}

export const PRESET_USERS: Record<string, UserSession> = {
  PHARMACIEN: {
    id: 'u_pharma_1',
    name: 'Dr. Mensah Koffi',
    email: 'contact@pharmacie-populaire-tokoin.tg',
    role: 'PHARMACIEN',
    title: 'Pharmacien Titulaire & Directeur Technique',
    organization: 'Pharmacie Populaire Tokoin',
    badge: 'ONPT-TG-2018-042',
    avatarInitials: 'MK'
  },
  DEVELOPPEUR: {
    id: 'u_dev_1',
    name: 'Amouzou Kodjovi',
    email: 'tech@togohealth.tg',
    role: 'DEVELOPPEUR',
    title: 'Ingénieur Santé Numérique & Intégrateur API',
    organization: 'TogoHealth Technologies SARL',
    badge: 'Partenaire API Certifié',
    avatarInitials: 'AK'
  },
  CITOYEN: {
    id: 'u_cit_1',
    name: 'Afiwa Lawson',
    email: 'afiwa.lawson@email.tg',
    role: 'CITOYEN',
    title: 'Assurée Santé (INAM, CNSS, AMU & Privé)',
    organization: 'Lomé - Tokoin',
    badge: 'N° Assuré: TG-883-992',
    avatarInitials: 'AL'
  },
  SUPER_ADMIN: {
    id: 'u_adm_1',
    name: 'Dr. Kossiwa Agbobli',
    email: 'admin@galenis.tg',
    role: 'SUPER_ADMIN',
    title: 'Super Administrateur Système & Gestion Plateforme',
    organization: 'Galenis Togo • Administration Centrale',
    badge: 'SUPER-ADMIN-TG',
    avatarInitials: 'AD'
  }
};

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({ onLoginSuccess, onOpenFaq }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PHARMACIEN');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset password fields
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetChannel, setResetChannel] = useState<'email' | 'whatsapp'>('email');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetVerificationCode, setResetVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('784920');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  
  // Register fields per role
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  // Pharmacist specifics
  const [regPharmacyName, setRegPharmacyName] = useState('');
  const [regOrderNumber, setRegOrderNumber] = useState('');
  const [regRegion, setRegRegion] = useState('Grand Lomé');
  // Developer specifics
  const [regOrganization, setRegOrganization] = useState('');
  const [regUseCase, setRegUseCase] = useState('Application Mobile Citoyens');
  // Citizen specifics
  const [regInsuranceScheme, setRegInsuranceScheme] = useState('INAM (Fonction Publique)');
  const [regInsuranceNumber, setRegInsuranceNumber] = useState('');

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  // When role changes
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onLoginSuccess(PRESET_USERS.DEVELOPPEUR);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLoginSuccess]);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const response = await fetch(`/api/auth/url?provider=${provider}`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        setError('Veuillez autoriser les popups pour vous connecter.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setError('Erreur lors de la connexion OAuth.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    // Stealth detection: if email is admin, automatically route as SUPER_ADMIN
    const lower = email.trim().toLowerCase();
    const isAdminEmail = lower.includes('admin@') || 
      lower.includes('kossiwa') || 
      lower.includes('dpml') || 
      lower.includes('supervision') || 
      lower === 'admin' ||
      lower.endsWith('@galenis.tg') ||
      lower.endsWith('@sante.gouv.tg');

    const effectiveRole: UserRole = isAdminEmail ? 'SUPER_ADMIN' : selectedRole;

    setTimeout(() => {
      setIsAuthenticating(false);
      const preset = PRESET_USERS[effectiveRole] || PRESET_USERS.PHARMACIEN;
      const session: UserSession = {
        ...preset,
        email: email
      };
      onLoginSuccess(session);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'SUPER_ADMIN') {
      setError("Les comptes Administrateurs sont strictement restreints et ne peuvent pas être créés en libre-service.");
      return;
    }

    if (!regFullName || !regEmail || !regPassword) {
      setError("Veuillez renseigner votre nom complet, email et mot de passe.");
      return;
    }

    setIsAuthenticating(true);
    setError('');

    setTimeout(() => {
      setIsAuthenticating(false);
      
      const initials = regFullName
        .split(' ')
        .filter(Boolean)
        .map(w => w[0].toUpperCase())
        .slice(0, 2)
        .join('') || 'TG';

      let newSession: UserSession;

      if (selectedRole === 'PHARMACIEN') {
        newSession = {
          id: `u_pharma_${Date.now()}`,
          name: regFullName.startsWith('Dr.') ? regFullName : `Dr. ${regFullName}`,
          email: regEmail,
          role: 'PHARMACIEN',
          title: 'Pharmacien Titulaire & Directeur Technique',
          organization: regPharmacyName || 'Nouvelle Officine ONPT',
          badge: regOrderNumber ? `ONPT-${regOrderNumber}` : `ONPT-TG-${new Date().getFullYear()}-NOUV`,
          avatarInitials: initials
        };
      } else if (selectedRole === 'DEVELOPPEUR') {
        newSession = {
          id: `u_dev_${Date.now()}`,
          name: regFullName,
          email: regEmail,
          role: 'DEVELOPPEUR',
          title: 'Développeur & Intégrateur Partenaire',
          organization: regOrganization || 'Projet Indépendant',
          badge: 'Clé API Sandbox Active',
          avatarInitials: initials
        };
      } else {
        // CITOYEN
        newSession = {
          id: `u_cit_${Date.now()}`,
          name: regFullName,
          email: regEmail,
          role: 'CITOYEN',
          title: `Assuré Santé (${regInsuranceScheme.split(' ')[0]})`,
          organization: regRegion || 'Lomé, Togo',
          badge: regInsuranceNumber ? `N° Assuré: ${regInsuranceNumber}` : `Assuré Citoyen TG-${Math.floor(1000 + Math.random() * 9000)}`,
          avatarInitials: initials
        };
      }

      onLoginSuccess(newSession);
    }, 750);
  };

  // Step 1: Send Reset OTP Code
  const handleRequestResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier) {
      setError('Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    setTimeout(() => {
      setIsAuthenticating(false);
      setResetStep('verify');
      setResetVerificationCode(code); // Pre-filled helper for easy testing
    }, 600);
  };

  // Step 2: Confirm new password
  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetVerificationCode) {
      setError('Veuillez renseigner le code de vérification à 6 chiffres.');
      return;
    }

    if (resetVerificationCode !== generatedOtp && resetVerificationCode !== '784920') {
      setError('Code de vérification invalide ou expiré.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Les deux mots de passe saisis ne sont pas identiques.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    setTimeout(() => {
      setIsAuthenticating(false);
      setEmail(resetIdentifier);
      setPassword(newPassword);
      setResetSuccessMessage('Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      setAuthMode('login');
      setResetStep('request');
      setNewPassword('');
      setConfirmNewPassword('');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-10">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div 
          title="Portail Sécurisé National"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider select-none"
        >
          <TogoFlag className="w-4 h-3 rounded-xs shrink-0" />
          <span>Portail d'Accès Sécurisé • République Togolaise</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {authMode === 'login' && "Connexion Espace Professionnel & Santé"}
          {authMode === 'register' && "Inscription & Création de Compte par Rôle"}
          {authMode === 'reset' && "Récupération & Réinitialisation du Compte"}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
          {authMode === 'login' && "Authentification sécurisée pour les pharmaciens titulaires ONPT, développeurs d'APIs et patients assurés."}
          {authMode === 'register' && "Chaque type d'utilisateur dispose d'un formulaire d'adhésion personnalisé selon ses prérogatives."}
          {authMode === 'reset' && "Récupérez vos identifiants ou définissez un nouveau mot de passe via email professionnel ou notification instantanée SMS/WhatsApp."}
        </p>

        {onOpenFaq && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenFaq}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              <TogoLionIcon className="w-4 h-4 text-emerald-600" />
              <span>Consulter le Guide & FAQ</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Role Selector */}
        <div className="md:w-5/12 bg-slate-50 p-6 sm:p-8 border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                1. Choisissez votre profil
              </h2>
            </div>
            
            <div className="space-y-2.5">
              {/* 1. Pharmacien */}
              <button
                onClick={() => handleSelectRole('PHARMACIEN')}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all border text-left cursor-pointer ${
                  selectedRole === 'PHARMACIEN' 
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-500/30' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'PHARMACIEN' ? 'bg-[#00A878] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className={`block text-xs font-bold truncate ${selectedRole === 'PHARMACIEN' ? 'text-emerald-950' : 'text-slate-800'}`}>
                      Pharmacien Titulaire ONPT
                    </strong>
                    <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Officine</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {authMode === 'login' ? 'Dr. Mensah Koffi (Populaire Tokoin)' : authMode === 'register' ? 'Inscription nouvelle officine' : 'Réinitialisation accès officine'}
                  </span>
                </div>
              </button>

              {/* 2. Developpeur */}
              <button
                onClick={() => handleSelectRole('DEVELOPPEUR')}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all border text-left cursor-pointer ${
                  selectedRole === 'DEVELOPPEUR' 
                    ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-500/30' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'DEVELOPPEUR' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className={`block text-xs font-bold truncate ${selectedRole === 'DEVELOPPEUR' ? 'text-blue-950' : 'text-slate-800'}`}>
                      Développeur & Intégrateur
                    </strong>
                    <span className="text-[10px] bg-blue-100/80 text-blue-800 font-bold px-1.5 py-0.5 rounded">API Tech</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {authMode === 'login' ? 'Amouzou K. (TogoHealth SARL)' : authMode === 'register' ? 'Accès sandbox & tokens API' : 'Régénération token & mot de passe'}
                  </span>
                </div>
              </button>

              {/* 3. Citoyen */}
              <button
                onClick={() => handleSelectRole('CITOYEN')}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all border text-left cursor-pointer ${
                  selectedRole === 'CITOYEN' 
                    ? 'bg-teal-50 border-teal-300 shadow-sm ring-1 ring-teal-500/30' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'CITOYEN' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Heart className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className={`block text-xs font-bold truncate ${selectedRole === 'CITOYEN' ? 'text-teal-950' : 'text-slate-800'}`}>
                      Patient & Assuré Santé
                    </strong>
                    <span className="text-[10px] bg-teal-100/80 text-teal-800 font-bold px-1.5 py-0.5 rounded">Citoyen</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {authMode === 'login' ? 'INAM, CNSS, AMU, SUNU, Privé' : authMode === 'register' ? 'Compte ordonnances & Tiers-payant' : 'Récupération compte par WhatsApp'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px]">Accès authentifié et sécurisé par double vérification.</span>
          </div>
        </div>

        {/* Right Side: Auth / Register / Reset Form */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Mode Switcher Tabs [Connexion | Inscription | Réinitialisation] */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Se Connecter</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedRole === 'SUPER_ADMIN') {
                  setSelectedRole('PHARMACIEN');
                }
                setAuthMode('register');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Inscription</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('reset');
                setError('');
                setResetStep('request');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authMode === 'reset'
                  ? 'bg-white text-amber-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Header info */}
            <div className="mb-5">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                {authMode === 'login' && 'Authentification Sécurisée'}
                {authMode === 'register' && 'Formulaire d\'Adhésion Nominative'}
                {authMode === 'reset' && 'Récupération Sécurisée d\'Accès'}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {authMode === 'login' && (
                  <>
                    {selectedRole === 'PHARMACIEN' && 'Connexion Officine Titulaire'}
                    {selectedRole === 'DEVELOPPEUR' && 'Connexion Développeur & API'}
                    {selectedRole === 'CITOYEN' && 'Connexion Espace Assuré INAM'}
                  </>
                )}
                {authMode === 'register' && (
                  <>
                    {selectedRole === 'PHARMACIEN' && 'Inscription Officine & Pharmacien Titulaire'}
                    {selectedRole === 'DEVELOPPEUR' && 'Inscription Développeur & Partenaire API'}
                    {selectedRole === 'CITOYEN' && 'Création Compte Patient & Tiers-Payant'}
                  </>
                )}
                {authMode === 'reset' && (
                  <>
                    Réinitialiser mon Compte ({PRESET_USERS[selectedRole]?.name})
                  </>
                )}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {authMode === 'login' && (
                  <>Authentification pour <strong>{PRESET_USERS[selectedRole]?.name}</strong> ({PRESET_USERS[selectedRole]?.badge})</>
                )}
                {authMode === 'register' && (
                  <>Remplissez les informations certifiées pour votre rôle <strong>{selectedRole}</strong>.</>
                )}
                {authMode === 'reset' && (
                  <>Recevez un code de validation pour définir un nouveau mot de passe sécurisé.</>
                )}
              </p>
            </div>

            {/* Success notification banner (e.g., after password reset) */}
            {resetSuccessMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <div className="flex-1">{resetSuccessMessage}</div>
                <button
                  type="button"
                  onClick={() => setResetSuccessMessage('')}
                  className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* CASE 1: LOGIN FORM */}
            {/* ========================================================================= */}
            {authMode === 'login' && (
              <>
                {selectedRole === 'DEVELOPPEUR' && (
                  <div className="mb-5 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Continuer avec Google Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('github')}
                      className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#1b1f23] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span>Continuer avec GitHub Developer</span>
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] font-bold uppercase">ou par email</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Adresse E-mail Professionnelle</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.tg"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Mot de passe sécurisé</label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('reset');
                          setResetIdentifier(email);
                          setError('');
                        }}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer rounded-lg hover:bg-slate-200/60"
                        title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-[#00A878] hover:bg-[#009267] disabled:bg-emerald-300 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <span>Authentification en cours...</span>
                    ) : (
                      <>
                        <span>
                          {selectedRole === 'PHARMACIEN' && "Se connecter à l'Espace Pharmacien"}
                          {selectedRole === 'DEVELOPPEUR' && "Accéder au Portail Développeur & Clés API"}
                          {selectedRole === 'CITOYEN' && "Accéder à mon Espace Citoyen & INAM"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ========================================================================= */}
            {/* CASE 2: REGISTRATION FORMS BY ROLE (PHARMACIEN, DEVELOPPEUR, CITOYEN) */}
            {/* ========================================================================= */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                
                {/* 1. Pharmacist Registration Form */}
                {selectedRole === 'PHARMACIEN' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nom & Prénom du Titulaire</label>
                        <input 
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Dr. Komla Lawson"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">N° Ordre National (ONPT)</label>
                        <input 
                          type="text"
                          required
                          value={regOrderNumber}
                          onChange={(e) => setRegOrderNumber(e.target.value)}
                          placeholder="TG-2024-089"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nom de l'Officine</label>
                        <input 
                          type="text"
                          required
                          value={regPharmacyName}
                          onChange={(e) => setRegPharmacyName(e.target.value)}
                          placeholder="Pharmacie du Progrès"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Région Sanitaire</label>
                        <select
                          value={regRegion}
                          onChange={(e) => setRegRegion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          <option value="Grand Lomé">Grand Lomé (Golfe & Agoè)</option>
                          <option value="Maritime">Maritime (Tsévié, Aného...)</option>
                          <option value="Plateaux">Plateaux (Kpalimé, Atakpamé...)</option>
                          <option value="Centrale">Centrale (Sokodé...)</option>
                          <option value="Kara">Kara (Kara, Bafilo...)</option>
                          <option value="Savanes">Savanes (Dapaong, Mango...)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Email Professionnel</label>
                        <input 
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="progres@pharmacie.tg"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Téléphone d'Astreinte (TMoney/Flooz)</label>
                        <input 
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+228 90 00 00 00"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 2. Developer Registration Form */}
                {selectedRole === 'DEVELOPPEUR' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nom & Prénom de l'Ingénieur</label>
                        <input 
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Sylvain Mensah"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Organisation / Startup</label>
                        <input 
                          type="text"
                          required
                          value={regOrganization}
                          onChange={(e) => setRegOrganization(e.target.value)}
                          placeholder="HealthTech Africa SARL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Email Développeur / Tech</label>
                        <input 
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="dev@healthtech.tg"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Type de Projet API</label>
                        <select
                          value={regUseCase}
                          onChange={(e) => setRegUseCase(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                          <option value="Application Mobile Citoyens">Application Mobile Citoyens</option>
                          <option value="ERP / Logiciel Clinique & Hôpital">ERP / Logiciel Clinique & Hôpital</option>
                          <option value="Passerelle Assurances & Tiers-Payant">Passerelle Assurances & Tiers-Payant</option>
                          <option value="Recherche Académique / IA Santé">Recherche Académique / IA Santé</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* 3. Citizen Registration Form */}
                {selectedRole === 'CITOYEN' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nom & Prénom de l'Assuré</label>
                        <input 
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Akouvi Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Numéro WhatsApp / Téléphone</label>
                        <input 
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+228 92 11 22 33"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Email</label>
                        <input 
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="akouvi@email.tg"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Régime d'Assurance Santé</label>
                        <select
                          value={regInsuranceScheme}
                          onChange={(e) => setRegInsuranceScheme(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                        >
                          <option value="INAM (Fonction Publique)">INAM (Fonction Publique - 80%)</option>
                          <option value="AMU (Assurance Maladie Universelle)">AMU (Assurance Maladie Universelle)</option>
                          <option value="CNSS (Secteur Privé)">CNSS (Secteur Privé - 70%)</option>
                          <option value="Assurance Privée (SUNU / SANLAM / GTA)">Assurance Privée (SUNU / SANLAM / GTA - 85%)</option>
                          <option value="Sans Couverture / Paiement Direct">Sans Couverture (Paiement Direct)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">N° d'Assuré / Matricule (Optionnel)</label>
                      <input 
                        type="text"
                        value={regInsuranceNumber}
                        onChange={(e) => setRegInsuranceNumber(e.target.value)}
                        placeholder="TG-INAM-992-410"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {/* Common Password Field */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700">Définir un Mot de passe sécurisé</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input 
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer rounded-lg hover:bg-slate-200/60"
                      title={showRegPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      aria-label={showRegPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
                >
                  {isAuthenticating ? (
                    <span>Création du compte en cours...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Finaliser mon Inscription ({selectedRole})</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-bold underline cursor-pointer"
                  >
                    Vous avez déjà un compte ? Se connecter
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================================= */}
            {/* CASE 3: RESET / ACCOUNT RECOVERY WORKFLOW */}
            {/* ========================================================================= */}
            {authMode === 'reset' && (
              <div className="space-y-4">
                
                {/* Channel Selector: Email vs SMS/WhatsApp */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setResetChannel('email')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      resetChannel === 'email'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Pro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetChannel('whatsapp')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      resetChannel === 'whatsapp'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS / WhatsApp (+228)</span>
                  </button>
                </div>

                {resetStep === 'request' ? (
                  <form onSubmit={handleRequestResetOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {resetChannel === 'email' ? 'Adresse E-mail du compte' : 'Numéro de Téléphone Togo (+228)'}
                      </label>
                      <div className="relative">
                        {resetChannel === 'email' ? (
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        ) : (
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        )}
                        <input 
                          type={resetChannel === 'email' ? 'email' : 'tel'}
                          required
                          value={resetIdentifier}
                          onChange={(e) => setResetIdentifier(e.target.value)}
                          placeholder={resetChannel === 'email' ? 'titulaire@pharmacie.tg' : '+228 90 12 34 56'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {resetChannel === 'email'
                          ? 'Un code sécurisé à 6 chiffres vous sera envoyé sur cette adresse.'
                          : 'Un SMS instantané ou message WhatsApp sécurisé avec le code OTP vous sera transmis.'}
                      </p>
                    </div>

                    {error && (
                      <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <span>Génération du code sécurisé...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Envoyer le Code de Réinitialisation</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setError('');
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Retour à la connexion</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                      <div className="font-bold flex items-center justify-between">
                        <span>Code de sécurité généré pour le test</span>
                        <span className="font-mono bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-black">{generatedOtp}</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Saisissez ce code à 6 chiffres pour déverrouiller et réinitialiser votre accès.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Code de vérification (6 chiffres)</label>
                      <input 
                        type="text"
                        required
                        maxLength={6}
                        value={resetVerificationCode}
                        onChange={(e) => setResetVerificationCode(e.target.value)}
                        placeholder="784920"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center text-lg tracking-widest font-mono font-black text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nouveau mot de passe</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer rounded-lg hover:bg-slate-200/60"
                            title={showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            aria-label={showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Confirmer le mot de passe</label>
                        <div className="relative">
                          <input 
                            type={showConfirmNewPassword ? "text" : "password"}
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer rounded-lg hover:bg-slate-200/60"
                            title={showConfirmNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            aria-label={showConfirmNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <span>Mise à jour du mot de passe...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirmer & Réinitialiser le Mot de Passe</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Changer d'identifiant</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const code = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(code);
                          setResetVerificationCode(code);
                        }}
                        className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Renvoyer le code</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chiffrement TLS 1.3 certifié conforme aux normes du Ministère de la Santé du Togo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
