// Edge & Browser compatible Web Crypto JWT implementation

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

// Helper to base64url encode
function base64urlEncode(buffer: ArrayBuffer | string): string {
  let bin = '';
  if (typeof buffer === 'string') {
    bin = buffer;
  } else {
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
  }
  return btoa(bin)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Helper to base64url decode
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

export interface JWTPayload {
  userId: string;
  employeeId: string;
  email: string;
  role: 'ADMIN' | 'HR_OFFICER' | 'EMPLOYEE';
  companyName: string;
  exp?: number;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64urlEncode(JSON.stringify(header));
  
  // Set default expiration to 1 day
  if (!payload.exp) {
    payload.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  }
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const keyData = encoder.encode(JWT_SECRET);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const signatureB64 = base64urlEncode(signature);
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const keyData = encoder.encode(JWT_SECRET);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Decode signature
    const signatureBin = base64urlDecode(signatureB64);
    const signatureBytes = new Uint8Array(signatureBin.length);
    for (let i = 0; i < signatureBin.length; i++) {
      signatureBytes[i] = signatureBin.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify('HMAC', cryptoKey, signatureBytes, data);
    if (!isValid) return null;
    
    const payload = JSON.parse(base64urlDecode(payloadB64)) as JWTPayload;
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}
