// sendEmail.js
import { getFieldValue } from './getFieldValue.js';
import { getElement } from './getElement.js';

export const sendEmail = formElements => {
  const passportFile = getElement('passportCopy')?.files[0];

  const sendFormData = passportAttachment => {
    const formData = {
      fullName: getFieldValue('fullName'),
      dob: getFieldValue('dob'),
      email: getFieldValue('email'),
      phone: getFieldValue('phone'),
      address: getFieldValue('address'),
      gender: getFieldValue('gender'),
      registrationType: formElements.registrationType?.value || '',
      classType: formElements.classType?.value || 'N/A',
      privateHours: getFieldValue('privateHours', 'N/A'),
      course: formElements.groupCourse?.value || 'N/A',
      classStartDate: getFieldValue('classStartDate', 'N/A'),
      examType: formElements.examType?.value || 'N/A',
      ieltsMode: formElements.ieltsMode?.value || 'N/A',
      examDate: getFieldValue('examDate', 'N/A'),
      passportAttachment: passportAttachment || 'N/A'
    };

    emailjs.send("service_msihk69", "template_chg044c", formData)
      .then(() => {
        alert('Registration successful!');
        formElements.registrationForm.reset();
      })
      .catch(() => {
        alert('Failed to send registration details. Please try again later.');
      });
  };

  if (passportFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64File = e.target.result;
      sendFormData(base64File);
    };
    reader.readAsDataURL(passportFile);
  } else {
    sendFormData(null);
  }
};
