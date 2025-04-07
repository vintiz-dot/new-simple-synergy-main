// updateTotalCost.js
import { calculateExamCost } from './calculateExamCost.js';
import { calculatePrivateClassCost } from './calculatePrivateClassCost.js';

export const updateTotalCost = async (formElements, { classFees, examFees }) => {
  let totalCost = 0;
  const { registrationType, classType, groupCourse, totalCostElement } = formElements;
  
  // Calculate class fees if applicable
  if (registrationType && ['classes', 'both'].includes(registrationType.value)) {
    if (classType.value === 'group' && groupCourse?.value) {
      // Normalize the group course key (case-insensitive lookup)
      const courseKey = groupCourse.value.trim().toLowerCase();
      const normalizedGroupFees = Object.fromEntries(
        Object.entries(classFees.groupClass).map(([key, value]) => [key.toLowerCase(), value])
      );
      if (normalizedGroupFees[courseKey] !== undefined) {
        totalCost += normalizedGroupFees[courseKey];
      } else {
        console.error(`Price for group course ${groupCourse.value} is not defined.`);
      }
    } else if (classType.value === 'private') {
      totalCost += calculatePrivateClassCost(formElements, classFees);
    }
  }
  
  // Add exam fees if applicable
  if (registrationType && ['exam', 'both'].includes(registrationType.value)) {
    totalCost += await calculateExamCost(formElements, examFees);
  }
  
  // Format the display. If private class fees are included (and only in classes or both),
  // append " per month" to the displayed total cost.
  let displayText = `₦${totalCost.toLocaleString()}`;
  if ((registrationType.value === 'classes' || registrationType.value === 'both') &&
      classType.value === 'private') {
    displayText += " per month";
  }
  
  totalCostElement.textContent = displayText;
};
