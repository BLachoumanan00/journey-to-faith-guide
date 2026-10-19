const encoder = new TextEncoder();
function base64(bytes: Uint8Array) { return btoa(Array.from(bytes, x => String.fromCharCode(x)).join("")); }
function unbase64(text: string) { return Uint8Array.from(atob(text), c => c.charCodeAt(0)); }
export async function fingerprint(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}
async function keyFor(secret: string) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function encryptValue(value: unknown, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFor(secret), encoder.encode(JSON.stringify(value)));
  return `v1.${base64(iv)}.${base64(new Uint8Array(encrypted))}`;
}
export async function decryptValue<T>(value: string, secret: string): Promise<T> {
  const [version, iv, ciphertext] = value.split(".");
  if (version !== "v1" || !iv || !ciphertext) throw new Error("Encrypted data unavailable");
  const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unbase64(iv) }, await keyFor(secret), unbase64(ciphertext));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}