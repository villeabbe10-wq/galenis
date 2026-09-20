import React from 'react';
import togoKoutammakou from '../assets/images/togo_koutammakou_1787660439101.jpg';
import togoLomeCoast from '../assets/images/togo_lome_coast_1787660463294.jpg';
import togoLakeHistory from '../assets/images/togo_lake_history_1787660481923.jpg';
import togoWaterfall from '../assets/images/togo_waterfall_1787660499456.jpg';

const TOGO_IMAGES = [
  {
    id: 'koutammakou',
    src: togoKoutammakou,
    title: 'Koutammakou',
    subtitle: "Patrimoine mondial de l'UNESCO",
  },
  {
    id: 'lome',
    src: togoLomeCoast,
    title: 'Côte de Lomé',
    subtitle: 'Ouverture sur le Golfe de Guinée',
  },
  {
    id: 'kpalime',
    src: togoWaterfall,
    title: 'Cascades de Kpalimé',
    subtitle: 'Richesse naturelle & Biodiversité',
  },
  {
    id: 'lac-togo',
    src: togoLakeHistory,
    title: 'Lac Togo',
    subtitle: 'Mémoire historique & Sérénité',
  },
];

// Create a robust set of base items to fill ultra-wide screens
const BASE_ITEMS = [...TOGO_IMAGES, ...TOGO_IMAGES, ...TOGO_IMAGES];
// Duplicate the base set to enable seamless 50% translation looping
const MARQUEE_ITEMS = [...BASE_ITEMS, ...BASE_ITEMS];

export function TogoHeritageGallery() {
  return (
    <div className="w-full bg-slate-50 text-slate-900 py-12 overflow-hidden border-t border-slate-200">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 50s linear infinite;
          }
          .pause-on-hover:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-black mb-3 tracking-wide uppercase text-slate-900">Couleurs & Rayonnement du Togo</h2>
        <p className="text-slate-600 text-sm sm:text-base font-medium">
          Découvrez une collection d'images célébrant notre patrimoine, nos paysages et le dynamisme de notre nation.
        </p>
      </div>

      <div className="relative w-full overflow-hidden pause-on-hover">
        {/* Soft edge gradients to blend the scrolling gallery into the background */}
        <div className="absolute top-0 left-0 w-12 sm:w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-12 sm:w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-4 sm:gap-6 px-4">
          {MARQUEE_ITEMS.map((img, index) => (
            <div
              key={`${img.id}-${index}`}
              className="group relative w-[260px] sm:w-[320px] lg:w-[400px] h-[360px] sm:h-[450px] shrink-0 rounded-3xl overflow-hidden cursor-pointer shadow-lg bg-slate-200"
            >
              <img
                src={img.src}
                alt={img.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              {/* Overlays for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1.5 bg-[#00A878] rounded-full shrink-0 shadow-md" />
                    <h3 className="text-white font-black text-lg sm:text-xl lg:text-2xl tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-nowrap">
                      {img.title}
                    </h3>
                  </div>
                  
                  <p className="text-emerald-100/90 font-semibold text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-2 pl-11 line-clamp-1">
                    {img.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
