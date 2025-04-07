// getFieldValue.js
import { getElement } from './getElement.js';
export const getFieldValue = (id, defaultVal = '') => getElement(id)?.value || defaultVal;
