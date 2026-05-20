import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
// Ensure encryption key is 32 bytes. In production, load from env
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "default_aes_key_32_bytes_long_12").substring(0, 32);

/**
 * Encrypts standard text using AES-256-GCM
 */
export function encrypt(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Format: iv:encryptedContent:authTag
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypts AES-256-GCM formatted cipher text
 */
export function decrypt(cipherText: string): string {
  if (!cipherText) return "";
  try {
    const parts = cipherText.split(":");
    if (parts.length !== 3) {
      // Return plaintext if it's already decrypted/unencrypted
      return cipherText;
    }
    
    const [ivHex, encrypted, authTagHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed. Returning fallback.", error);
    return "DECRYPTION_ERROR";
  }
}
