import { isUserHasId } from "grammy-guard";
import { directus } from "~/lib/directus/client.js";

export function isAdmin() {
  const { admins } = directus;
  const adminTelegramIds = admins.flatMap((admin) => admin.telegram_ids);
  return isUserHasId(...adminTelegramIds);
}
