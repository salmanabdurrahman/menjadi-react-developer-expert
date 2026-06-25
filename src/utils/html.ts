const BLOCKED_TAGS = ['script', 'style', 'iframe', 'object', 'embed'];
const URI_ATTRIBUTES = ['href', 'src', 'xlink:href'];

function isUnsafeUrl(value: string) {
  return /^\s*(javascript|data|vbscript):/i.test(value);
}

export function sanitizeHtml(html: string) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return stripDangerousHtml(html);
  }

  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll(BLOCKED_TAGS.join(',')).forEach((element) => {
    element.remove();
  });

  document.body.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value;

      if (attributeName.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (URI_ATTRIBUTES.includes(attributeName) && isUnsafeUrl(attributeValue)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}

function stripDangerousHtml(html: string) {
  return html
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/\s(href|src|xlink:href)=("|')?\s*(javascript|data|vbscript):[^\s>]*/gi, '');
}
