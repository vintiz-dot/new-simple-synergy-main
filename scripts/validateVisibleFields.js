// validateVisibleFields.js
export const validateVisibleFields = registrationForm => {
    const fields = registrationForm.querySelectorAll('input, select');
    let valid = true;
    fields.forEach(field => {
      if (field.required && !field.value) {
        console.log(`Invalid field: ${field.id} - value: ${field.value}`);
        valid = false;
      }
    });
    return valid;
  };
  