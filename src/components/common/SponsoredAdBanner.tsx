import React, { useEffect, useState } from 'react';
import { 
  AdBanner, 
  AdPlacement 
} from '../../types';
import { 
  getActiveAdBannerByPlacement, 
  recordAdImpression, 
  recordAdClick 
} from '../../services/pharmacyStorage';
import { LionIcon } from '../LionIcon';
import { 
  ExternalLink, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface SponsoredAdBannerProps {
  placement: AdPlacement;
  className?: string;
  compact?: boolean;
}

export const SponsoredAdBanner: React.FC<SponsoredAdBannerProps> = ({
  placement,
  className = '',
  compact = false
}) => {
  const [banner, setBanner] = useState<AdBanner | null>(null);

  useEffect(() => {
    const active = getActiveAdBannerByPlacement(placement);
    if (active) {
      setBanner(active);
      recordAdImpression(active.id);
    }
  }, [placement]);

  if (!banner) return null;

  const handleClick = (e: React.MouseEvent) => {
    recordAdClick(banner.id);
  };

  const hasLink = Boolean(banner.targetUrl && banner.callToAction);

  if (compact) {
    return (
      <div 
        id={`sponsored-ad-${banner.id}`}
        className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-all hover:shadow-sm ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Tête de Lion - Emblème Officiel de l'application */}
            <div className="w-9 h-9 rounded-xl bg-[#008760] text-white flex items-center justify-center shrink-0 shadow-2xs p-1.5">
              <LionIcon className="w-full h-full text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-200/60">
                  {banner.badgeText || 'Partenaire Santé'}
                </span>
                <span className="text-xs font-bold text-slate-700 truncate">{banner.advertiser}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-0.5 truncate">{banner.title}</h4>
            </div>
          </div>

          {hasLink && (
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <a
                href={banner.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>{banner.callToAction}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`sponsored-ad-${banner.id}`}
      className={`bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all hover:border-emerald-300 hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            {banner.badgeText || 'Espace Partenaire & Sponsoring Santé'}
          </span>
          <span className="text-xs font-bold text-slate-600">• {banner.advertiser}</span>
        </div>
        <span className="text-[10px] text-slate-600 font-semibold flex items-center gap-1" title="Annonce contrôlée Galenis Togo">
          <Info className="w-3 h-3" />
          Sponsorisé
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          {/* Tête de Lion - Emblème Officiel */}
          <div className="w-10 h-10 rounded-xl bg-[#008760] text-white flex items-center justify-center shrink-0 shadow-2xs p-2 mt-0.5">
            <LionIcon className="w-full h-full text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              {banner.title}
            </h3>
            {banner.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {banner.subtitle}
              </p>
            )}
          </div>
        </div>

        {hasLink && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full md:w-auto">
            <a
              href={banner.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>{banner.callToAction}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
