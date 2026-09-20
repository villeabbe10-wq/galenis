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
import { 
  Sparkles, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
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

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAdClick(banner.id);
    const phone = banner.targetWhatsapp || banner.targetPhone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour, je vous contacte suite à votre annonce sur Galenis Togo : "${banner.title}"`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAdClick(banner.id);
    window.location.href = `tel:${banner.targetPhone}`;
  };

  if (compact) {
    return (
      <div 
        id={`sponsored-ad-${banner.id}`}
        className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-100" />
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

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {banner.targetWhatsapp && (
              <button
                type="button"
                onClick={handleWhatsApp}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            )}
            <a
              href={banner.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>{banner.callToAction || 'En savoir plus'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`sponsored-ad-${banner.id}`}
      className={`bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all hover:border-emerald-300 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            {banner.badgeText || 'Espace Partenaire & Sponsoring Santé'}
          </span>
          <span className="text-xs font-bold text-slate-600">• {banner.advertiser}</span>
        </div>
        <span className="text-[10px] text-slate-600 font-semibold flex items-center gap-1" title="Annonce sponsorisée contrôlée par la régie Galenis Togo">
          <Info className="w-3 h-3" />
          Sponsorisé
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            {banner.title}
          </h3>
          {banner.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {banner.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full md:w-auto">
          {banner.targetPhone && (
            <button
              type="button"
              onClick={handleCall}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{banner.targetPhone}</span>
            </button>
          )}
          {banner.targetWhatsapp && (
            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </button>
          )}
          <a
            href={banner.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>{banner.callToAction || 'Profiter de l\'offre'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
