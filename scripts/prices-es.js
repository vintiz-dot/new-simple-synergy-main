// prices-es.js

// Import the legacy prices.js so that it runs and attaches to window.
import './prices.js';

// Check that the legacy module is available.
if (!window.pricesModule) {
  console.error("prices-es.js: window.pricesModule is undefined. Please check that prices.js is loaded correctly.");
}

// Re-export named values from the legacy module.
export const classFees = window.pricesModule?.classFees;
export const examFees = window.pricesModule?.examFees;
export const prices = window.pricesModule?.prices;
