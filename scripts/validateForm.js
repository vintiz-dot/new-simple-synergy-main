// validateForm.js
import { validateVisibleFields } from './validateVisibleFields.js';
import { sendEmail } from './sendEmail.js';

export const validateForm = formElements => {
  if (validateVisibleFields(formElements.registrationForm)) {
    sendEmail(formElements);
  } else {
    console.log("Form is invalid. Please complete all required fields.");
  }
};
