// toggleClassOptions.js
import { toggleDisplay } from './toggleDisplay.js';
import { updateTotalCost } from './updateTotalCost.js';

export const toggleClassOptions = (formElements, formSections, prices) => {
  const { classType } = formElements;
  toggleDisplay(formSections.groupClassCourses, classType.value === 'group');
  toggleDisplay(formSections.privateClassOptions, classType.value === 'private');
  updateTotalCost(formElements, prices);
};
