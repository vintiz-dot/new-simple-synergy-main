// exchangeRateCache.js
import { getExchangeRate } from './getExchangeRate.js';

let cachedExchangeRate = null;

export const prefetchExchangeRate = async () => {
  cachedExchangeRate = await getExchangeRate();
  //console.log("Prefetched exchange rate:", cachedExchangeRate);
  return cachedExchangeRate;
};

export const getCachedExchangeRate = async () => {
  if (cachedExchangeRate === null) {
    cachedExchangeRate = await getExchangeRate();
  }
  return cachedExchangeRate;
};
