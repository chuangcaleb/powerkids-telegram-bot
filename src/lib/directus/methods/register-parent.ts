import { updateItem } from "@directus/sdk";
import { client } from "../client.js";

export async function registerParent(parentIc: string, telegramId: number) {
  return client.request(
    updateItem("parent", parentIc, { telegram_id: telegramId })
  );
}
