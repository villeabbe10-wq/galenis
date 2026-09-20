import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  Clock, 
  AlertTriangle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { TogoFlag, ONPTLogo } from './TogoEmblems';

export const ContactsView: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('INSCRIPTION_OFFICINE');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A878]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-[#00A878]/40">
            <PhoneCall className="w-3.5 h-3.5 text-[#00A878]" />
            <span>ASSISTANCE NATIONALE & INSTITUTIONNELLE 24H/24</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-3">
            <span>Contacts & Support Officiel</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Une question sur le référencement de votre officine ? Besoin d'assistance pour l'intégration des API hospitalières ? Contactez directement nos équipes à Lomé.
          </p>
        </div>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Official Entities */}
        <div className="lg:col-span-1 space-y-6">
          {/* ONPT Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold shrink-0 border border-emerald-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Ordre des Pharmaciens</h3>
                <p className="text-[11px] text-emerald-600 font-bold">Siège National - Lomé</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>188 Boulevard du Haho, Hédzranawoé, BP 3109, Lomé, Togo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="tel:+22896373730" className="text-slate-900 hover:text-emerald-600 font-bold">
                  +228 96 37 37 30
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="mailto:contact@ordredespharmaciens.tg" className="text-slate-900 hover:text-emerald-600 font-bold">
                  contact@ordredespharmaciens.tg
                </a>
              </div>
            </div>
          </div>

          {/* Emergency Hotlines Card */}
          <div className="bg-rose-900 text-white p-6 rounded-3xl border border-rose-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-300" />
              <span>Lignes d'Urgence Médicale</span>
            </div>

            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between border-b border-rose-800/80 pb-1.5">
                <span className="text-rose-200">SAMU / Sapeurs-Pompiers :</span>
                <span className="font-black text-rose-100 text-sm bg-rose-800 px-2 py-0.5 rounded">118</span>
              </li>
              <li className="flex items-center justify-between border-b border-rose-800/80 pb-1.5">
                <span className="text-rose-200">Police Secours :</span>
                <span className="font-black text-rose-100 text-sm bg-rose-800 px-2 py-0.5 rounded">117</span>
              </li>
              <li className="flex items-center justify-between border-b border-rose-800/80 pb-1.5">
                <span className="text-rose-200">CHU Sylvanus Olympio :</span>
                <span className="font-bold text-rose-100 text-xs">+228 22 21 25 01</span>
              </li>
              <li className="flex items-center justify-between border-b border-rose-800/80 pb-1.5">
                <span className="text-rose-200">CHU Campus :</span>
                <span className="font-bold text-rose-100 text-xs">+228 22 25 47 12</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-rose-200">CHU Kara :</span>
                <span className="font-bold text-rose-100 text-xs">+228 26 60 01 25</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Formulaire de Contact & Assistance</span>
            </h2>
            <p className="text-xs text-slate-500">Envoyez directement votre message à l'équipe technique Galenis Togo</p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">Message Transmis avec Succès !</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Merci <strong>{formName}</strong>. Notre cellule d'assistance prendra contact avec vous dans un délai maximal de 24h.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom / Raison Sociale <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Dr. KOFFI Mawuli"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Professionnel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="koffi@pharmacie-lome.tg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone (Togo)
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+228 90 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Objet de la Demande
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-slate-50"
                  >
                    <option value="INSCRIPTION_OFFICINE">Inscription & Référencement Officine</option>
                    <option value="API_INTEGRATION">Intégration API & Logiciel Caisse</option>
                    <option value="SIGNALEMENT_DONNEES">Signalement d'Erreur sur une Pharmacie</option>
                    <option value="AUTRE">Autre Demande Institutionnelle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Votre Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Détaillez votre demande ici..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
