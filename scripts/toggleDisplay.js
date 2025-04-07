// toggleDisplay.js
export const toggleDisplay = (element, condition) => {
    if (element) {
      element.style.display = condition ? 'block' : 'none';
      element.querySelectorAll('input, select').forEach(input => {
        condition ? input.setAttribute('required', 'required') : input.removeAttribute('required');
      });
    }
  };
  