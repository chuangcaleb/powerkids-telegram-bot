import { config } from "#root/config.js";
import { splitAt } from "#root/lib/string.js";
import crypto from "node:crypto";

const key = crypto
  .createHash("sha512")
  .update(config.ENCRYPTION_KEY)
  .digest("base64")
  .slice(0, 32);

export function decrypt(payload: string) {
  const [iv, ciphertext] = splitAt(payload, 16);

  const decipher = crypto.createDecipheriv(config.ENCRYPTION_METHOD, key, iv);
  return (
    decipher.update(ciphertext, "base64url", "utf8") + decipher.final("utf8")
  );
}
