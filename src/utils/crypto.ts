// Simple XOR cipher implementation
const STATIC_KEY = 'GPT';

function xorCipher(str: string, key: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

export function encodePrompt(prompt: string): string {
  const encoded = xorCipher(prompt, STATIC_KEY);
  return btoa(encoded).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodePrompt(encoded: string): string {
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return xorCipher(decoded, STATIC_KEY);
  } catch (e) {
    return '';
  }
}
