import React, { useState } from 'react';
import { Pharmacy } from '../../types';
import { PartnerMarquee } from '../PartnerMarquee';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send,
  Users,
  Activity,
  CreditCard,
  Building,
  HeartPulse,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface PartnerNetworkViewProps {
  pharmacies: Pharmacy[];
}

export const PartnerNetworkView: React.FC<PartnerNetworkViewProps> = ({ pharmacies }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('TOUTES');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('TOUTES');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Form state for institution access request
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('HOPITAL');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const insurances = ['INAM', 'CNSS', 'SUNU Assurances', 'SAHAM / SANLAM', 'NSIA Assurances', 'Gras Savoye'];

  const filteredPharmacies = pharmacies.filter(p => {
    const matchesRegion = selectedRegion === 'TOUTES' || p.region === selectedRegion;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName || !contactEmail) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setInstitutionName('');
      setContactEmail('');
      setContactPhone('');
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner - Clean Light Theme */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-200/80 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-black tracking-wide uppercase">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>Réseau Santé & Assurances Togo</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900">
            Interconnexion pour Hôpitaux, Cliniques & Assurances
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Espace d'orientation médicale et de vérification institutionnelle. Permet aux structures sanitaires, aux Sapeurs-Pompiers (118), aux services de secours et aux organismes d'assurance (INAM, CNSS, Sunu...) d'accéder au registre officiel des pharmacies et des gardes nationales au Togo.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 font-bold">Accréditation Officielle Officines</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-800 font-bold">Suivi Temps Réel Pharmacies de Garde</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-2xs">
              <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-800 font-bold">Référentiel Tiers-Payant & Conventions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Clean Light Theme Partner Carousel */}
      <PartnerMarquee theme="light" className="rounded-3xl shadow-xs border border-slate-200 bg-white" />

      {/* 3 Pillars / User Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Pour les Hôpitaux & Urgences</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Orientez immédiatement vos patients sortant des urgences nocturnes vers la pharmacie de garde la plus proche avec confirmation de disponibilité des médicaments essentiels.
          </p>
          <ul className="text-xs space-y-1.5 text-slate-700 font-medium pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Liaison directe CHU & Centres de Santé</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Vérification des officines ouvertes 24h/24</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Pour les Assurances & Mutuelles</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vérifiez l'homologation des officines partenaires (INAM, CNSS, Assurances privées) et simplifiez la prise en charge en tiers-payant pour vos assujettis.
          </p>
          <ul className="text-xs space-y-1.5 text-slate-700 font-medium pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Base certifiée des pharmaciens titulaires</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Contrôle automatisé des autorisations</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Pour les Sapeurs-Pompiers & Secours (118/117)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Accédez à une carte en direct actualisée par les pharmaciens eux-mêmes lors de leurs gardes de nuit et jours fériés à Lomé et en région.
          </p>
          <ul className="text-xs space-y-1.5 text-slate-700 font-medium pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Localisation GPS exacte & Numéros d'urgence</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Mises à jour instantanées en cas de garde</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Directory for Institutional Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Annuaire Institutionnel & Agrément des Officines</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consultez l'état d'accréditation et la liste des établissements de santé selon les données et référentiels de l'Ordre National des Pharmaciens du Togo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="TOUTES">Toutes les Régions</option>
              <option value="Maritime">Maritime (Lomé / Tsévié)</option>
              <option value="Plateaux">Plateaux (Atakpamé / Kpalimé)</option>
              <option value="Centrale">Centrale (Sokodé)</option>
              <option value="Kara">Kara (Kara / Bassar)</option>
              <option value="Savanes">Savanes (Dapaong / Mango)</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom de pharmacie, ville ou nom du pharmacien titulaire..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Table / List of Accredited Pharmacies */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Etablissement / Pharmacie</th>
                <th className="py-3 px-4">Localisation & Ville</th>
                <th className="py-3 px-4">Pharmacien Titulaire</th>
                <th className="py-3 px-4">Statut Actuel</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPharmacies.slice(0, 8).map((pharmacy) => (
                <tr key={pharmacy.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {pharmacy.name.charAt(10) || 'P'}
                      </div>
                      <div>
                        <div>{pharmacy.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal">N° Homologation: TG-OFF-{pharmacy.id.padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{pharmacy.city} ({pharmacy.region})</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{pharmacy.address}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    Dr. {pharmacy.pharmacistInCharge}
                  </td>
                  <td className="py-3.5 px-4">
                    {pharmacy.status === 'DE_GARDE' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>DE GARDE (24H)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Ouverte (Journée)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{pharmacy.phone}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Access Request Form */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Demande d'Accréditation Institutionnelle</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Vous êtes un Hôpital, une Assurance ou un Service d'Urgence ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Obtenez des accès privilégiés au système de synchronisation des gardes nationales, des extractions de données certifiées et un canal direct avec les pharmaciens titulaires.
          </p>
          <div className="space-y-2 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Accès gratuit pour les hôpitaux publics & CHU du Togo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Assistance d'intégration sous 24h ouvrées</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-lg">
          {formSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Demande Transmise !</h4>
              <p className="text-xs text-slate-600">
                L'équipe administrative du Ministère et de l'Ordre prendra contact avec votre établissement dans les plus brefs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nom de l'Etablissement / Organisme</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Ex: CHU Sylvanus Olympio, INAM Togo, SUNU Assurances..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Type d'Organisme</label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="HOPITAL">Centre Hospitalier / CHU / Clinique</option>
                  <option value="ASSURANCE">Compagnie d'Assurance / Mutuelle de Santé</option>
                  <option value="URGENCE">Sapeurs-Pompiers & Services de Secours (118/117)</option>
                  <option value="AUTRE">Organisme Public / Ministère</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="direction@hopital.tg"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Téléphone de Contact</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+228 90 00 00 00"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Soumettre la demande d'accès</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
