// formHandler.js

import { classFees, examFees } from './prices-es.js';
import { getElement } from './getElement.js';
import { getFieldValue } from './getFieldValue.js';
import { toggleDisplay } from './toggleDisplay.js';
import { resetFields } from './resetFields.js';
import { getExchangeRate } from './getExchangeRate.js';
import { calculatePrivateClassCost } from './calculatePrivateClassCost.js';
import { calculateExamCost } from './calculateExamCost.js';
import { updateTotalCost } from './updateTotalCost.js';
import { toggleExamOptions } from './toggleExamOptions.js';
import { toggleRegistrationOptions } from './toggleRegistrationOptions.js';
import { toggleClassOptions } from './toggleClassOptions.js';
import { validateVisibleFields } from './validateVisibleFields.js';
import { validateForm } from './validateForm.js';
import { prefetchExchangeRate } from './exchangeRateCache.js';

document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS
  emailjs.init("aAS2beu7Twp64U6jd");

  // Define form elements
  const formElements = {
    fullName: getElement('fullName'),
    dob: getElement('dob'),
    email: getElement('email'),
    phone: getElement('phone'),
    address: getElement('address'),
    gender: getElement('gender'),
    registrationType: getElement('registrationType'),
    classType: getElement('classType'),
    groupCourse: getElement('groupCourse'),
    privateLocation: getElement('privateLocation'),
    privateSchedule: getElement('privateSchedule'),
    examType: getElement('examType'),
    ieltsMode: getElement('ieltsMode'),
    ieltsCategory: getElement('ieltsCategory'),
    ieltsCategoryExam: getElement('ieltsCategoryExam'),
    totalCostElement: getElement('totalCost'),
    registrationForm: getElement('registrationForm'),
    submitButton: getElement('submit-button')
  };

  // Define conditional form sections
  const formSections = {
    classRegistrationSection: getElement('classRegistrationSection'),
    examRegistrationSection: getElement('examRegistrationSection'),
    groupClassCourses: getElement('groupClassCourses'),
    privateClassOptions: getElement('privateClassOptions'),
    ieltsOptions: getElement('ieltsOptions'),
    ieltsCategory: getElement('ieltsCategory')
  };

  // Attach event listeners (using a DRY approach)
  [
    { element: formElements.registrationType, event: 'change', handler: () => toggleRegistrationOptions(formElements, formSections, { classFees, examFees }) },
    { element: formElements.classType, event: 'change', handler: () => toggleClassOptions(formElements, formSections, { classFees, examFees }) },
    { element: formElements.groupCourse, event: 'change', handler: () => updateTotalCost(formElements, { classFees, examFees }) },
    { element: formElements.privateLocation, event: 'change', handler: () => updateTotalCost(formElements, { classFees, examFees }) },
    { element: formElements.privateSchedule, event: 'change', handler: () => updateTotalCost(formElements, { classFees, examFees }) },
    { element: formElements.examType, event: 'change', handler: () => {
        toggleExamOptions(formElements, formSections, { classFees, examFees });
        // Prefetch exchange rate if exam is not IELTS
        const examTypeVal = formElements.examType.value.trim().toLowerCase();
        if (examTypeVal !== 'ielts') {
          prefetchExchangeRate();
        }
      }
    },
    { element: formElements.ieltsMode, event: 'change', handler: () => updateTotalCost(formElements, { classFees, examFees }) },
    { element: formElements.ieltsCategory, event: 'change', handler: () => updateTotalCost(formElements, { classFees, examFees }) },
    { element: formElements.submitButton, event: 'click', handler: () => validateForm(formElements) }
  ].forEach(({ element, event, handler }) => {
    if (element) element.addEventListener(event, handler);
  });
});
