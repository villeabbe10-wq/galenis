import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Phone,
  ArrowRight,
  User,
  CheckCircle2
} from 'lucide-react';
import { MobilePaymentType, ServiceType } from '../../types';

interface PharmacyRegistrationFormProps {
  onRegister: (data: any) => void;
  onLoginClick: () => void;
}

export const PharmacyRegistrationForm: React.FC<PharmacyRegistrationFormProps> = ({
  onRegister,
  onLoginClick
}) => {
  const [name, setName] = useState('');
  const [pharmacist, setPharmacist] = useState('');
  const [agreement, setAgreement] = useState('');
  
  const [region, setRegion] = useState('Maritime (Lomé / Tsévié)');
  const [city, setCity] = useState('Lomé');
  const [phone, setPhone] = useState('+228 ');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('+228 ');
  
  const [payments, setPayments] = useState<MobilePaymentType[]>(['T-Money', 'Flooz']);
  const [services, setServices] = useState<ServiceType[]>(['PAIEMENT_MOBILE', 'CONSEIL_ORAL']);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [termsAccepted, setTermsAccepted] = useState(false);

  const ALL_PAYMENTS: MobilePaymentType[] = ['T-Money', 'Flooz', 'Carte Bancaire'];
  const ALL_SERVICES: { id: ServiceType; label: string }[] = [
    { id: 'GARDE_24H', label: 'GARDE 24H' },
    { id: 'PAIEMENT_MOBILE', label: 'PAIEMENT MOBILE' },
    { id: 'LIVRAISON', label: 'LIVRAISON' },
    { id: 'TEST_RAPIDE_PALU', label: 'TEST RAPIDE PALU' },
    { id: 'PRISE_TENSION', label: 'PRISE TENSION' },
    { id: 'TEST_GLYCEMIE', label: 'TEST GLYCÉMIE' },
    { id: 'CONSEIL_ORAL', label: 'CONSEIL PHARMACEUTIQUE' },
  ];

  const togglePayment = (p: MobilePaymentType) => {
    if (payments.includes(p)) setPayments(payments.filter(item => item !== p));
    else setPayments([...payments, p]);
  };

  const toggleService = (s: ServiceType) => {
    if (services.includes(s)) setServices(services.filter(item => item !== s));
    else setServices([...services, s]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    onRegister({
      name,
      pharmacistInCharge: pharmacist,
      agreement,
      region,
      city,
      phone,
      address,
      whatsapp,
      mobilePayments: payments,
      services,
      email,
      password
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
          <User className="w-3.5 h-3.5" />
          <span>Formulaire d'Enregistrement Officiel</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Inscrire une Nouvelle Pharmacie au Togo
        </h1>
        <p className="text-slate-600">
          Renseignez les informations officielles de votre officine pour la référencer sur la carte citoyenne et le réseau national.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
            <Building2 className="w-5 h-5" />
            <span>1. IDENTITÉ DE L'OFFICINE & TITULAIRE</span>
          </h2>
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Nom de la Pharmacie <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pharmacie du Progrès"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Pharmacien Titulaire <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={pharmacist}
              onChange={(e) => setPharmacist(e.target.value)}
              placeholder="Ex: Dr. Amadou Bello"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Numéro d'Agrément Ordre des Pharmaciens (Optionnel)</label>
            <input 
              type="text" 
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
              placeholder="Ex: TG-OFF-2026-104"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
            <Phone className="w-5 h-5" />
            <span>2. LOCALISATION & COORDONNÉES</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">Région</label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                <option>Maritime (Lomé / Tsévié)</option>
                <option>Plateaux (Kpalimé / Atakpamé)</option>
                <option>Centrale (Sokodé)</option>
                <option>Kara (Kara)</option>
                <option>Savanes (Dapaong)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">Ville / Quartier</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lomé"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Téléphone Appel</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+228"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Adresse Physique Précise</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Boulevard du 13 Janvier, en face de la banque"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Numéro WhatsApp Pro</label>
            <input 
              type="text" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+228"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
            <CreditCard className="w-5 h-5" />
            <span>3. SERVICES PROPOSÉS & PAIEMENTS ACCEPTÉS</span>
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Paiements Mobiles Acceptés</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PAYMENTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePayment(p)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    payments.includes(p) 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {payments.includes(p) ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4" />}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-bold text-slate-800">Services & Soins en Officine</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SERVICES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    services.includes(s.id) 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {services.includes(s.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 opacity-20" />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
            <Lock className="w-5 h-5" />
            <span>4. IDENTIFIANTS DE CONNEXION</span>
          </h2>
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Email Officiel</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="direction@pharmacie.tg"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-800">Mot de passe de gestion</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>5. ENGAGEMENT DÉONTOLOGIQUE & CONDITIONS GÉNÉRALES</span>
          </h2>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 appearance-none border-2 border-slate-300 rounded cursor-pointer checked:bg-emerald-600 checked:border-emerald-600 transition-colors"
              />
              <CheckCircle2 className={`w-3.5 h-3.5 text-white absolute pointer-events-none transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="text-sm text-slate-600 leading-relaxed">
              J'atteste être un pharmacien titulaire ou délégué autorisé en République Togolaise. J'accepte la{' '}
              <a href="#" className="font-bold text-emerald-600 hover:underline">Charte de Déontologie Numérique</a>{' '}
              et les{' '}
              <a href="#" className="font-bold text-emerald-600 hover:underline">Conditions Générales d'Utilisation</a>{' '}
              de Galenis Togo (Ordre National des Pharmaciens).
            </span>
          </label>

          <a href="#" className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors ml-8">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Lire le Texte Intégral de la Charte de Déontologie (ONPT Togo)</span>
          </a>
        </section>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!termsAccepted}
            className="w-full bg-[#00A878] hover:bg-[#009267] disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Valider l'Inscription & Accéder au Tableau de Bord</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="text-center mt-6">
            <span className="text-slate-500 text-sm">Vous possédez déjà un compte officine ? </span>
            <button 
              type="button" 
              onClick={onLoginClick}
              className="text-[#00A878] font-bold text-sm hover:underline"
            >
              Se connecter directement
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
