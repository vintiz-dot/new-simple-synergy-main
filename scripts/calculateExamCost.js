// calculateExamCost.js
import { getCachedExchangeRate } from './exchangeRateCache.js';
import { examFees } from './prices.js';

export const calculateExamCost = async (formElements) => {
  let totalCost = 0;
  const examType = formElements.examType?.value?.trim().toLowerCase();

  if (examType === 'ielts') {
    const rawMode = formElements.ieltsMode?.value;
    const rawCategory = formElements.ieltsCategoryExam?.value;
    const mode = rawMode && rawMode.trim() ? rawMode.trim().toLowerCase() : 'paper';
    const category = rawCategory && rawCategory.trim() ? rawCategory.trim().toLowerCase() : 'academic';

    if (examFees.ieltsExam[mode] && examFees.ieltsExam[mode][category] !== undefined) {
      totalCost = examFees.ieltsExam[mode][category];
    } else {
      console.error('IELTS exam fee not found for mode:', rawMode, 'and category:', rawCategory);
    }
  } else if (['gre', 'gmat', 'sat', 'toefl', 'pte'].includes(examType)) {
    const examTypeKey = examType;
    if (examFees.usdExams[examTypeKey] !== undefined) {
      const usdFee = parseInt(examFees.usdExams[examTypeKey], 10);
      // Use the cached exchange rate
      const exchangeRate = await getCachedExchangeRate();
      if (exchangeRate) {
        totalCost = usdFee * exchangeRate;
      } else {
        console.error("Exchange rate not available.");
      }
    } else {
      console.error(`Price for exam ${examTypeKey} is not defined in the examFees module.`);
    }
  }
  return totalCost;
};
