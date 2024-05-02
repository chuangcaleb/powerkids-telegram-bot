import { Context } from "~/bot/context.js";
import { directus } from "~/lib/directus/client.js";

export async function isAdmin(ctx: Context) {
  const { admins } = directus;
  const adminTelegramIds = admins.flatMap((admin) => admin.telegram_ids);
  if (!ctx?.msg?.from) return false;
  return adminTelegramIds.includes(ctx.msg.from.id);
}
