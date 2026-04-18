export function sanitizeHtml(str) {
 
  if (str === undefined || str === null) return '';
  if (typeof str !== 'string') return String(str);
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeHtml(str) {
  return sanitizeHtml(str);
}