import { Context } from "~/bot/context.js";
import { client } from "~/lib/directus/client.js";

export function isAdmin(ctx: Context) {
  const { adminTelegramIds: adminIds } = client;
  if (!ctx?.msg?.from) return false;
  return adminIds.has(ctx.msg.from.id);
}
