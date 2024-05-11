import { readUsers } from "@directus/sdk";
import { client } from "../client.js";

export function validateAdmin(telegramId: number) {
  return client.request(
    readUsers({
      fields: ["first_name", "telegram_ids"],
      filter: {
        telegram_ids: {
          // @ts-expect-error: Ah, CSV field is stored as plain string. Typechecking doesn't allow certain array queries
          // https://github.com/directus/directus/issues/22176
          _contains: String(telegramId),
        },
      },
      limit: 1,
    })
  );
}
