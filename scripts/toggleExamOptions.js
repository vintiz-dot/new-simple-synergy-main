// toggleExamOptions.js
import { toggleDisplay } from './toggleDisplay.js';
import { resetFields } from './resetFields.js';
import { updateTotalCost } from './updateTotalCost.js';

export const toggleExamOptions = (formElements, formSections, prices) => {
  const { examType } = formElements;
  if (examType.value === 'ielts') {
    toggleDisplay(formSections.ieltsOptions, true);
    toggleDisplay(formSections.ieltsCategory, true);
  } else {
    toggleDisplay(formSections.ieltsOptions, false);
    toggleDisplay(formSections.ieltsCategory, false);
    resetFields(formSections.ieltsOptions);
    resetFields(formSections.ieltsCategory);
  }
  updateTotalCost(formElements, prices);
};
