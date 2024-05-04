import { readUser, updateUser } from "@directus/sdk";
import { client } from "../base-client.js";

export async function authenticateAdmin(userId: string, telegramId: number) {
  const { telegram_ids: oldTelegramIds } = await client.request(
    readUser(userId, { fields: ["telegram_ids"] })
  );
  // dedupe admin (should have been caught, but just as precaution)
  const newTelegramIds = new Set([
    ...(oldTelegramIds ?? []),
    String(telegramId),
  ]);
  return client.request(
    updateUser(userId, {
      telegram_ids: [...newTelegramIds],
    })
  );
}
