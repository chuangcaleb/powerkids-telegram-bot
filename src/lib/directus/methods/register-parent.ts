import { readItem, updateItem } from "@directus/sdk";
import { client } from "../base-client.js";

export async function registerParent(studentId: string, telegramId: number) {
  const { telegram_ids: oldTelegramIds } = await client.request(
    readItem("student", studentId, { fields: ["telegram_ids"] })
  );
  // dedupe (should have been caught, but just as precaution)
  const newTelegramIds = new Set([
    ...(oldTelegramIds ?? []),
    String(telegramId),
  ]);
  return client.request(
    updateItem("student", studentId, {
      telegram_ids: [...newTelegramIds],
    })
  );
}
