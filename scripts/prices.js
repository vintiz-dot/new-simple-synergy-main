// prices.js

// Define fees for classes
const classFees = {
    groupClass: {
      IELTS: 90000,
      GRE: 120000,
      GMAT: 150000,
      TOEFL: 60000,
      PTE: 60000,
      SAT: 100000
    },
    privateClass: {
      center: 10000,
      'client-location': 11000
    }
  };
    
  // Define fees for exams
  const examFees = {
    ieltsExam: {
      paper: { academic: 258000, general: 258000, ukvi: 287000 },
      computer: { academic: 268000, general: 268000, ukvi: 287000 }
    },
    usdExams: {
      gre: 270,
      gmat: 310,
      sat: 140,
      toefl: 190,
      pte: 200
    }
  };
    
  // For backward compatibility, merge classFees and examFees into one object.
  const prices = { ...classFees, ...examFees };
    
  // UMD wrapper for backward compatibility
  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
    } else {
      root.pricesModule = factory();
    }
  }(typeof self !== 'undefined' ? self : this, function () {
    return {
      classFees,
      examFees,
      prices
    };
  }));
  
  // Also export as ES module (if supported)
  export { classFees, examFees, prices };
  