// toggleRegistrationOptions.js
import { toggleDisplay } from './toggleDisplay.js';
import { resetFields } from './resetFields.js';
import { toggleClassOptions } from './toggleClassOptions.js';
import { toggleExamOptions } from './toggleExamOptions.js';
import { updateTotalCost } from './updateTotalCost.js';

export const toggleRegistrationOptions = (formElements, formSections, prices) => {
  const { registrationType } = formElements;
  const isClass = ['classes', 'both'].includes(registrationType.value);
  const isExam = ['exam', 'both'].includes(registrationType.value);
  toggleDisplay(formSections.classRegistrationSection, isClass);
  if (isClass) {
    toggleClassOptions(formElements, formSections, prices);
  } else {
    resetFields(formSections.classRegistrationSection);
  }
  toggleDisplay(formSections.examRegistrationSection, isExam);
  if (isExam) {
    toggleExamOptions(formElements, formSections, prices);
  } else {
    resetFields(formSections.examRegistrationSection);
  }
  updateTotalCost(formElements, prices);
};
