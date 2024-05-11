import { readUsers } from "@directus/sdk";
import { client } from "../client.js";

export function getAdmins() {
  return client.request(
    readUsers({ fields: ["id", "first_name", "telegram_ids"], limit: 999 })
  );
}
