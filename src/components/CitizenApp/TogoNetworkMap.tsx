import React, { useState } from 'react';
import { Activity, Wifi, Radio, MapPin, CheckCircle2, Building2 } from 'lucide-react';

interface CityNode {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  labelAlign: 'start' | 'end' | 'middle';
  labelDx: number;
  labelDy: number;
  pharmaciesCount: number;
  guardCount: number;
  latencyMs: number;
  status: 'ONLINE' | 'SYNCING';
}

interface TogoNetworkMapProps {
  onSelectCity?: (cityName: string) => void;
  selectedCity?: string;
}

// Projection coordinates fitted precisely inside viewBox="-50 -30 400 840"
const CITIES: CityNode[] = [
  { id: 'dapaong', name: 'Dapaong', region: 'Savanes', x: 60, y: 35, labelAlign: 'start', labelDx: 12, labelDy: 4, pharmaciesCount: 9, guardCount: 2, latencyMs: 14, status: 'ONLINE' },
  { id: 'kara', name: 'Kara', region: 'Kara', x: 195, y: 160, labelAlign: 'start', labelDx: 12, labelDy: 4, pharmaciesCount: 18, guardCount: 4, latencyMs: 12, status: 'ONLINE' },
  { id: 'sokode', name: 'Sokodé', region: 'Centrale', x: 205, y: 250, labelAlign: 'start', labelDx: 12, labelDy: 4, pharmaciesCount: 15, guardCount: 3, latencyMs: 11, status: 'ONLINE' },
  { id: 'atakpame', name: 'Atakpamé', region: 'Plateaux', x: 180, y: 380, labelAlign: 'start', labelDx: 12, labelDy: 4, pharmaciesCount: 12, guardCount: 3, latencyMs: 10, status: 'ONLINE' },
  { id: 'kpalime', name: 'Kpalimé', region: 'Plateaux', x: 95, y: 565, labelAlign: 'end', labelDx: -12, labelDy: 4, pharmaciesCount: 14, guardCount: 3, latencyMs: 9, status: 'ONLINE' },
  { id: 'tsevie', name: 'Tsévié', region: 'Maritime', x: 180, y: 665, labelAlign: 'start', labelDx: 12, labelDy: 4, pharmaciesCount: 11, guardCount: 2, latencyMs: 8, status: 'ONLINE' },
  { id: 'lome', name: 'Lomé', region: 'Maritime (Capitale)', x: 180, y: 730, labelAlign: 'end', labelDx: -12, labelDy: 4, pharmaciesCount: 68, guardCount: 14, latencyMs: 5, status: 'ONLINE' },
  { id: 'aneho', name: 'Aného', region: 'Maritime', x: 260, y: 715, labelAlign: 'start', labelDx: 10, labelDy: -8, pharmaciesCount: 8, guardCount: 2, latencyMs: 7, status: 'ONLINE' },
];

const CONNECTIONS = [
  { id: 'c1', from: 'lome', to: 'tsevie', path: 'M 180 730 L 180 665', color: '#059669', duration: '2.5s' },
  { id: 'c2', from: 'tsevie', to: 'atakpame', path: 'M 180 665 L 180 380', color: '#059669', duration: '3s' },
  { id: 'c3', from: 'atakpame', to: 'kpalime', path: 'M 180 380 L 95 565', color: '#d97706', duration: '2.2s' },
  { id: 'c4', from: 'atakpame', to: 'sokode', path: 'M 180 380 L 205 250', color: '#059669', duration: '3.2s' },
  { id: 'c5', from: 'sokode', to: 'kara', path: 'M 205 250 L 195 160', color: '#059669', duration: '2.8s' },
  { id: 'c6', from: 'kara', to: 'dapaong', path: 'M 195 160 L 60 35', color: '#059669', duration: '3.5s' },
  { id: 'c7', from: 'lome', to: 'aneho', path: 'M 180 730 L 260 715', color: '#0284c7', duration: '2s' },
];

// Official Togo Silhouette Path
const TOGO_OFFICIAL_PATH = `
  M 300 718.6
  L 173.9 750
  L 138.9 698.3
  L 97.2 604.7
  L 84.7 531.4
  L 119.4 398.7
  L 80.1 345.0
  L 65.1 228.9
  L 65.4 121.9
  L 0 45.9
  L 11.5 0
  L 148.7 3.1
  L 128.8 80.7
  L 176.7 124.2
  L 231.1 175.8
  L 237.0 248.1
  L 268.6 278.5
  L 274.2 371.1
  L 282.0 474.2
  L 289.8 592.0
  L 300.7 680.4
  Z
`;

export const TogoNetworkMap: React.FC<TogoNetworkMapProps> = ({ onSelectCity, selectedCity }) => {
  const [hoveredCity, setHoveredCity] = useState<CityNode | null>(null);

  const activeCity = hoveredCity || CITIES.find(c => c.name.toLowerCase() === selectedCity?.toLowerCase()) || CITIES[6];

  return (
    <div className="bg-white text-slate-900 rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-6 relative overflow-hidden mt-8">
      {/* Background Decorative Soft Lights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>RÉSEAU INTERCONNECTÉ NATIONAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Carte du Togo & Liaisons de Garde
          </h3>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-3 shrink-0">
          <Wifi className="w-4 h-4 text-emerald-600 animate-pulse" />
          <div className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>8 Villes Synchronisées</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map vs Selected Node */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-5 relative z-10">
        
        {/* SVG Map Container (Light Canvas with ample padding so nothing is cut off) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[480px] bg-slate-50/90 rounded-2xl border border-slate-200 p-4 shadow-inner">
          
          <svg
            viewBox="-50 -35 400 840"
            className="w-full max-w-[320px] h-auto drop-shadow-md overflow-visible"
          >
            <defs>
              <linearGradient id="togoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ecfdf5" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="oceanGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.3" />
              </linearGradient>

              <filter id="glowLight" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Band */}
            <rect x="-40" y="755" width="380" height="40" fill="url(#oceanGradientLight)" rx="6" />
            <text x="150" y="780" fill="#0284c7" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
              GOLFE DE GUINÉE / OCÉAN ATLANTIQUE
            </text>

            {/* Neighbor Country Labels (Cleanly outside Togo borders) */}
            <text x="-25" y="380" fill="#334155" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="2" textAnchor="middle" transform="rotate(-90, -25, 380)">
              GHANA
            </text>
            <text x="325" y="380" fill="#334155" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="2" textAnchor="middle" transform="rotate(90, 325, 380)">
              BÉNIN
            </text>
            <text x="75" y="-15" fill="#334155" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5" textAnchor="middle">
              BURKINA FASO
            </text>

            {/* Official Contour of Togo */}
            <path
              d={TOGO_OFFICIAL_PATH}
              fill="url(#togoGradientLight)"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Static Connection Lines */}
            {CONNECTIONS.map((conn) => (
              <path
                key={`base-${conn.id}`}
                d={conn.path}
                stroke={conn.color}
                strokeWidth="2.5"
                strokeOpacity="0.4"
                fill="none"
              />
            ))}

            {/* Pulsing Lines & Traveling Spheres */}
            {CONNECTIONS.map((conn) => (
              <g key={`anim-${conn.id}`}>
                <path
                  d={conn.path}
                  stroke={conn.color}
                  strokeWidth="3.5"
                  strokeOpacity="0.85"
                  fill="none"
                  strokeDasharray="10 10"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="20"
                    to="0"
                    dur={conn.duration}
                    repeatCount="indefinite"
                  />
                </path>

                <circle r="4.5" fill="#047857" filter="url(#glowLight)">
                  <animateMotion
                    path={conn.path}
                    dur={conn.duration}
                    repeatCount="indefinite"
                  />
                </circle>

                <circle r="2.5" fill="#ffffff">
                  <animateMotion
                    path={conn.path}
                    dur={conn.duration}
                    begin="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}

            {/* City Nodes */}
            {CITIES.map((city) => {
              const isSelected = activeCity.id === city.id;
              const isLome = city.id === 'lome';

              return (
                <g
                  key={city.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => {
                    setHoveredCity(city);
                    if (onSelectCity) onSelectCity(city.name);
                  }}
                  onMouseEnter={() => setHoveredCity(city)}
                >
                  {/* Outer Pulsing Wave Ring */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? "18" : "12"}
                    fill="none"
                    stroke={isLome ? "#dc2626" : "#059669"}
                    strokeWidth="1.5"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values={isSelected ? "12;26;12" : "7;17;7"}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0;0.8"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Core Node Circle */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? "8" : "5.5"}
                    fill={isLome ? "#dc2626" : "#059669"}
                  />

                  {/* White Center Dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? "3.5" : "2"}
                    fill="#ffffff"
                  />

                  {/* High contrast ultra-black city label with thick white halo outline */}
                  <text
                    x={city.x + city.labelDx}
                    y={city.y + city.labelDy}
                    fill="#000000"
                    stroke="#ffffff"
                    strokeWidth="4"
                    paintOrder="stroke fill"
                    strokeLinejoin="round"
                    fontSize={isSelected ? "13" : "11"}
                    fontWeight="900"
                    fontFamily="sans-serif"
                    textAnchor={city.labelAlign}
                    className="select-none"
                  >
                    {city.name} {isLome ? '(Capitale)' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Column: Node Details (Light Card) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <div className="text-xs text-black font-extrabold uppercase tracking-wider">Ville Sélectionnée</div>
                  <h4 className="text-lg font-black text-black flex items-center gap-2">
                    <span>{activeCity.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-black">
                      {activeCity.region}
                    </span>
                  </h4>
                </div>
              </div>

              {onSelectCity && (
                <button
                  onClick={() => onSelectCity(activeCity.name)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  Filtrer Officines
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                <div className="text-[10px] text-black font-extrabold">Pharmacies</div>
                <div className="text-xl font-black text-black mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>{activeCity.pharmaciesCount}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                <div className="text-[10px] text-black font-extrabold">De Garde</div>
                <div className="text-xl font-black text-amber-700 mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>{activeCity.guardCount} active{activeCity.guardCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-black font-bold">Temps de Réponse API :</span>
                <span className="font-mono font-black text-amber-700">{activeCity.latencyMs} ms</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-black font-bold">Statut Réseau :</span>
                <span className="font-black text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Liaison Active</span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
