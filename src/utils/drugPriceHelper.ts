import { PharmacyDrugStock } from '../types';

export interface DrugPriceStats {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  hasRange: boolean;
  sampleCount: number;
  formattedRange: string;
  variationPercentage: number;
}

/**
 * Calculates real-time price range & statistical distribution for a given drug across pharmacies
 */
export function getDrugPriceStats(
  drugId: string, 
  stocks: PharmacyDrugStock[] = [], 
  fallbackPrice?: number
): DrugPriceStats {
  const relevantStocks = stocks.filter(s => s.drugId === drugId && typeof s.priceFcfa === 'number' && s.priceFcfa > 0);
  const prices = relevantStocks.map(s => s.priceFcfa);

  if (prices.length === 0) {
    const base = fallbackPrice || 1000;
    return {
      minPrice: base,
      maxPrice: base,
      avgPrice: base,
      hasRange: false,
      sampleCount: 0,
      formattedRange: `${base.toLocaleString()} FCFA`,
      variationPercentage: 0
    };
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((acc, curr) => acc + curr, 0) / prices.length);
  const hasRange = minPrice !== maxPrice;
  const variationPercentage = hasRange && minPrice > 0 
    ? Math.round(((maxPrice - minPrice) / minPrice) * 100) 
    : 0;

  return {
    minPrice,
    maxPrice,
    avgPrice,
    hasRange,
    sampleCount: prices.length,
    formattedRange: hasRange 
      ? `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} FCFA`
      : `${minPrice.toLocaleString()} FCFA`,
    variationPercentage
  };
}
