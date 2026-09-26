import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { 
  Pill, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Layers, 
  FileSpreadsheet, 
  FileText, 
  Sparkles,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TogoLionIcon } from '../TogoEmblems';

// Données de distribution par type / classe thérapeutique
const THERAPEUTIC_CATEGORIES_DATA = [
  { name: 'Antipaludiques (ACT / Artémisinine)', shortName: 'Antipaludiques', volume: 14250, share: 34.2, stockRate: 94.5, color: '#00A859' },
  { name: 'Antibiotiques & Anti-infectieux', shortName: 'Antibiotiques', volume: 9600, share: 23.0, stockRate: 86.2, color: '#0284C7' },
  { name: 'Antalgiques & Antipyrétiques', shortName: 'Antalgiques', volume: 7550, share: 18.1, stockRate: 98.0, color: '#F59E0B' },
  { name: 'Cardiovasculaire & Hypertension', shortName: 'Cardio / HTA', volume: 3820, share: 9.2, stockRate: 91.0, color: '#8B5CF6' },
  { name: 'Anti-ulcéreux & Gastro-entérologie', shortName: 'Gastro', volume: 2500, share: 6.0, stockRate: 93.4, color: '#EC4899' },
  { name: 'Antidiabétiques & Métabolisme', shortName: 'Diabète', volume: 1880, share: 4.5, stockRate: 88.5, color: '#06B6D4' },
  { name: 'Santé Maternelle & Vitamines', shortName: 'Vitamines / Mère', volume: 1450, share: 3.5, stockRate: 96.0, color: '#10B981' },
  { name: 'Autres Spécialités & Urgences', shortName: 'Autres', volume: 620, share: 1.5, stockRate: 89.0, color: '#64748B' },
];

// Top 10 Médicaments individuels les plus recherchés
const TOP_REQUESTED_DRUGS = [
  { name: 'Paracétamol 1g (Comprimé)', category: 'Antalgique', queries: 4850, trend: '+14%', status: 'DISPONIBLE' },
  { name: 'Coartem 80/480mg (Artéméther/Luméfantrine)', category: 'Antipaludique', queries: 4320, trend: '+28%', status: 'DISPONIBLE' },
  { name: 'Amoxicilline 1g (Comprimé dispersible)', category: 'Antibiotique', queries: 3210, trend: '+8%', status: 'TENSION' },
  { name: 'Ibuprofène 400mg', category: 'Anti-inflammatoire', queries: 2450, trend: '+5%', status: 'DISPONIBLE' },
  { name: 'SRO (Sels de Réhydratation Orale)', category: 'Pédiatrie', queries: 1980, trend: '+19%', status: 'DISPONIBLE' },
  { name: 'Oméprazole 20mg (Gélule)', category: 'Gastro', queries: 1840, trend: '+6%', status: 'DISPONIBLE' },
  { name: 'Amlodipine 5mg / 10mg', category: 'Cardio / HTA', queries: 1620, trend: '+11%', status: 'DISPONIBLE' },
  { name: 'Metformine 850mg', category: 'Antidiabétique', queries: 1390, trend: '+9%', status: 'DISPONIBLE' },
  { name: 'Ciprofloxacine 500mg', category: 'Antibiotique', queries: 1250, trend: '-2%', status: 'DISPONIBLE' },
  { name: 'Vitamine C 1000mg Effervescente', category: 'Vitamine', queries: 1120, trend: '+15%', status: 'DISPONIBLE' }
];

// Données par Forme Galénique
const GALENIC_FORMS_DATA = [
  { name: 'Comprimés & Gélules', value: 62, color: '#00A859' },
  { name: 'Sirops & Suspensions Buvables', value: 20, color: '#0284C7' },
  { name: 'Injectables & Perfusions', value: 9, color: '#F59E0B' },
  { name: 'Pommades & Crèmes Dermiques', value: 5, color: '#8B5CF6' },
  { name: 'Collyres & Gouttes', value: 4, color: '#EC4899' },
];

// Évolution temporelle (Tendances mensuelles au Togo)
const MONTHLY_TREND_DATA = [
  { month: 'Mai', Antipaludiques: 13200, Antibiotiques: 8100, Antalgiques: 6800, Total: 28100 },
  { month: 'Juin', Antipaludiques: 16800, Antibiotiques: 9200, Antalgiques: 7200, Total: 33200 },
  { month: 'Juil', Antipaludiques: 18400, Antibiotiques: 9800, Antalgiques: 7600, Total: 35800 },
  { month: 'Août', Antipaludiques: 14900, Antibiotiques: 8900, Antalgiques: 7100, Total: 30900 },
  { month: 'Sept', Antipaludiques: 15400, Antibiotiques: 9400, Antalgiques: 7400, Total: 32200 },
  { month: 'Oct', Antipaludiques: 17200, Antibiotiques: 9900, Antalgiques: 7800, Total: 34900 },
];

// Radar par région sanitaire du Togo
const REGIONAL_DEMAND_RADAR = [
  { region: 'Grand Lomé', Antipaludiques: 95, Antibiotiques: 88, Antalgiques: 92, TensionStock: 12 },
  { region: 'Maritime', Antipaludiques: 85, Antibiotiques: 78, Antalgiques: 84, TensionStock: 18 },
  { region: 'Plateaux (Kpalimé/Atakpamé)', Antipaludiques: 89, Antibiotiques: 75, Antalgiques: 80, TensionStock: 22 },
  { region: 'Centrale (Sokodé)', Antipaludiques: 82, Antibiotiques: 70, Antalgiques: 76, TensionStock: 25 },
  { region: 'Kara', Antipaludiques: 80, Antibiotiques: 68, Antalgiques: 74, TensionStock: 20 },
  { region: 'Savanes (Dapaong)', Antipaludiques: 86, Antibiotiques: 72, Antalgiques: 79, TensionStock: 28 },
];

export const DrugDemandAnalyticsView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'30D' | '90D' | '1Y'>('30D');
  const [selectedRegion, setSelectedRegion] = useState<string>('TOUTES');
  const [activeChartTab, setActiveChartTab] = useState<'BAR' | 'AREA' | 'PIE' | 'RADAR'>('BAR');
  const [searchFilter, setSearchFilter] = useState('');

  // Filtrer les médicaments individuels
  const filteredDrugs = useMemo(() => {
    return TOP_REQUESTED_DRUGS.filter(d => 
      d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.category.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  // Exportation PDF du rapport d'analyse
  const exportPDFReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 168, 89);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GALENIS TOGO - RAPPORT ANALYTIQUE DE LA DEMANDE PHARMACEUTIQUE', 14, 15);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-TG')} à ${new Date().toLocaleTimeString('fr-TG')}`, 14, 32);
    doc.text(`Période d'analyse : ${selectedPeriod === '30D' ? '30 Derniers Jours' : selectedPeriod === '90D' ? '90 Derniers Jours' : '12 Mois'} | Région : ${selectedRegion}`, 14, 38);
    
    // Table 1: Catégories Thérapeutiques
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Distribution par Type / Classe Thérapeutique', 14, 48);
    
    const categoryRows = THERAPEUTIC_CATEGORIES_DATA.map(c => [
      c.name,
      c.volume.toLocaleString('fr-FR') + ' req.',
      c.share.toFixed(1) + ' %',
      c.stockRate.toFixed(1) + ' %'
    ]);

    autoTable(doc, {
      startY: 52,
      head: [['Classe Thérapeutique', 'Volume Requêtes', 'Part de Demande', 'Taux Disponibilité']],
      body: categoryRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 168, 89], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9 }
    });

    // Table 2: Top 10 Médicaments
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Top 10 des Médicaments les Plus Demandés en Officine', 14, finalY);

    const drugRows = TOP_REQUESTED_DRUGS.map((d, i) => [
      `#${i + 1}`,
      d.name,
      d.category,
      d.queries.toLocaleString('fr-FR'),
      d.trend,
      d.status
    ]);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['N°', 'Dénomination Médicament', 'Catégorie', 'Requêtes Citoyens', 'Tendance', 'Statut Stock']],
      body: drugRows,
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8.5 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Galenis Togo HealthTech • Système National d\'Intelligence Pharmaceutique • Confidentiel & Officiel', 14, 288);
      doc.text(`Page ${i}/${pageCount}`, 190, 288);
    }

    doc.save(`Rapport_Demande_Medicaments_Galenis_${Date.now()}.pdf`);
  };

  // Export CSV
  const exportCSVReport = () => {
    let csv = 'Classe Therapeutique;Volume Requetes;Part Pourcentage;Taux Disponibilite\n';
    THERAPEUTIC_CATEGORIES_DATA.forEach(c => {
      csv += `"${c.name}";${c.volume};${c.share};${c.stockRate}\n`;
    });
    csv += '\nTop Medicaments;Categorie;Requetes;Tendance;Statut\n';
    TOP_REQUESTED_DRUGS.forEach(d => {
      csv += `"${d.name}";"${d.category}";${d.queries};"${d.trend}";"${d.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Analyse_Demande_Medicaments_Togo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Context */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Pill className="w-5 h-5 text-[#00A859]" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Distribution & Analyse de la Demande des Médicaments</span>
                <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Recharts Pro
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Cartographie en temps réel des besoins citoyens et volumes de recherche en pharmacie au Togo
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons & Period filters */}
        <div className="flex items-center gap-2.5 flex-wrap self-end md:self-center">
          {/* Period selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setSelectedPeriod('30D')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedPeriod === '30D' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              30 Jours
            </button>
            <button
              onClick={() => setSelectedPeriod('90D')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedPeriod === '90D' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setSelectedPeriod('1Y')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedPeriod === '1Y' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              12 Mois
            </button>
          </div>

          {/* Export PDF */}
          <button
            onClick={exportPDFReport}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Exporter le rapport PDF officiel"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSVReport}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            title="Exporter les données CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Queries */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Requêtes Citoyennes Médicaments</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">41 470</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs mois précédent</span>
          </div>
        </div>

        {/* Top Demanded Category */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Catégorie N°1 en Demande</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
              34.2%
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight truncate">Antipaludiques (ACT)</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5 truncate">
            14 250 recherches • Pic saison des pluies
          </div>
        </div>

        {/* Average Stock Availability Rate */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Taux Moyen de Disponibilité</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">92.4%</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5">
            Sur 240+ officines interconnectées
          </div>
        </div>

        {/* High Tension Molecule */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Molécule sous Vigilance</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-black text-amber-900 tracking-tight truncate">Amoxicilline 1g Dispersible</div>
          <div className="text-xs text-amber-700 font-semibold mt-1.5">
            Tension d'approvisionnement CAMEG
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        
        {/* Chart View Switcher Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Visualisation Recharts : Distribution de la Demande par Catégorie
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Analyse quantitative des requêtes de disponibilité et de prix soumises par les patients et praticiens
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setActiveChartTab('BAR')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeChartTab === 'BAR' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Histogramme
            </button>
            <button
              onClick={() => setActiveChartTab('AREA')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeChartTab === 'AREA' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Évolution
            </button>
            <button
              onClick={() => setActiveChartTab('PIE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeChartTab === 'PIE' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Part de Marché
            </button>
            <button
              onClick={() => setActiveChartTab('RADAR')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeChartTab === 'RADAR' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Radar Régional
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-[380px] w-full pt-2">
          {activeChartTab === 'BAR' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={THERAPEUTIC_CATEGORIES_DATA} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="shortName" 
                  angle={-25} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickFormatter={(val) => `${val.toLocaleString('fr-FR')}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString('fr-FR')} requêtes (${THERAPEUTIC_CATEGORIES_DATA.find(c => c.volume === value)?.share || ''}%)`,
                    'Volume de Demande'
                  ]}
                />
                <Bar 
                  dataKey="volume" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200}
                >
                  {THERAPEUTIC_CATEGORIES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'AREA' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorPaludisme" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A859" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00A859" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorAntibiotiques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorAntalgiques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="Antipaludiques" stroke="#00A859" fillOpacity={1} fill="url(#colorPaludisme)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Antibiotiques" stroke="#0284C7" fillOpacity={1} fill="url(#colorAntibiotiques)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Antalgiques" stroke="#F59E0B" fillOpacity={1} fill="url(#colorAntalgiques)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'PIE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={THERAPEUTIC_CATEGORIES_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="share"
                  >
                    {THERAPEUTIC_CATEGORIES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value) => [`${value}%`, 'Part de la Demande']}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {THERAPEUTIC_CATEGORIES_DATA.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{cat.shortName}</div>
                      <div className="text-[11px] text-slate-500">{cat.share}% ({cat.volume.toLocaleString('fr-FR')} req.)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChartTab === 'RADAR' && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={120} data={REGIONAL_DEMAND_RADAR}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="region" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Antipaludiques" dataKey="Antipaludiques" stroke="#00A859" fill="#00A859" fillOpacity={0.4} />
                <Radar name="Antibiotiques" dataKey="Antibiotiques" stroke="#0284C7" fill="#0284C7" fillOpacity={0.3} />
                <Radar name="Tension Stock (%)" dataKey="TensionStock" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Two Column Section: Forme Galénique & Top 10 Requested Drugs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Répartition par Forme Galénique */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Distribution par Forme Galénique
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Total 100%</span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GALENIC_FORMS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {GALENIC_FORMS_DATA.map((entry, index) => (
                    <Cell key={`cell-galenic-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Proportion']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {GALENIC_FORMS_DATA.map((form, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: form.color }} />
                  <span className="font-bold text-slate-700">{form.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{form.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Table Top 10 Médicaments Demandés */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Top Médicaments les Plus Demandés en Officine
              </h3>
            </div>

            {/* Live search in table */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer médicament..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">Médicament & Dosage</th>
                  <th className="py-2 px-2">Classe</th>
                  <th className="py-2 px-2 text-right">Requêtes</th>
                  <th className="py-2 px-2 text-center">Tendance</th>
                  <th className="py-2 px-3 text-right">Disponibilité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDrugs.map((drug, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{drug.name}</div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 font-semibold">{drug.category}</td>
                    <td className="py-2.5 px-2 text-right font-black text-slate-900">
                      {drug.queries.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                        drug.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {drug.trend}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {drug.status === 'DISPONIBLE' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Normal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Tension
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Données certifiées conformes aux remontées du cadastre sanitaire DPML Togo</span>
            </span>
            <span className="font-bold">Actualisation 24h/24</span>
          </div>
        </div>
      </div>
    </div>
  );
};
