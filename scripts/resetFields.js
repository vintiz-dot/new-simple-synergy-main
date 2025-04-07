// resetFields.js
export const resetFields = section => {
    if (!section) return;
    section.querySelectorAll('input, select').forEach(input => (input.value = ''));
  };
  