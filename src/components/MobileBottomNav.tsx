import React from 'react';
import { ActiveTab, UserSession } from '../types';
import { Smartphone, Lock, Building2, ShieldCheck, PhoneCall, User, Code2, Shield } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser?: UserSession | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  setActiveTab,
  currentUser
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-1 pb-safe pt-1">
      <div className="flex justify-between items-center h-14 max-w-md mx-auto">
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('CITIZEN'); }}
          className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
            activeTab === 'CITIZEN' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${activeTab === 'CITIZEN' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[9px]">Accueil</span>
        </button>

        {/* Dynamic authenticated button vs Login button */}
        {currentUser ? (
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('USER_PROFILE'); }}
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
              activeTab === 'USER_PROFILE' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'USER_PROFILE' ? 'stroke-[2.5] text-emerald-700' : 'stroke-2'}`} />
            <span className="text-[9px] truncate max-w-[60px]">Mon Compte</span>
          </button>
        ) : (
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('LOGIN'); }}
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
              activeTab === 'LOGIN' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className={`w-5 h-5 ${activeTab === 'LOGIN' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[9px]">Connexion</span>
          </button>
        )}

        {/* Direct role dashboard access */}
        {currentUser?.role === 'DEVELOPPEUR' ? (
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('API_PORTAL'); }}
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
              activeTab === 'API_PORTAL' ? 'text-blue-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className={`w-5 h-5 ${activeTab === 'API_PORTAL' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[9px]">Espace Dev</span>
          </button>
        ) : currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'DATA_ADMIN' ? (
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('ADMIN_DASHBOARD'); }}
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
              activeTab === 'ADMIN_DASHBOARD' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className={`w-5 h-5 ${activeTab === 'ADMIN_DASHBOARD' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[9px]">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('PHARMACY_DASHBOARD'); }}
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
              activeTab === 'PHARMACY_DASHBOARD' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className={`w-5 h-5 ${activeTab === 'PHARMACY_DASHBOARD' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[9px]">Pharmacie</span>
          </button>
        )}

        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('PARTNER_NETWORK'); }}
          className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
            activeTab === 'PARTNER_NETWORK' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${activeTab === 'PARTNER_NETWORK' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[9px]">Partenaires</span>
        </button>

        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('CONTACTS'); }}
          className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 cursor-pointer ${
            activeTab === 'CONTACTS' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PhoneCall className={`w-5 h-5 ${activeTab === 'CONTACTS' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[9px]">Contact</span>
        </button>
      </div>
    </div>
  );
};
