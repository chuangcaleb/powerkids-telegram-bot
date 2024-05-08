import { Context } from "#root/bot/context.js";
import { client } from "#root/lib/directus/client.js";

export function isAdmin(ctx: Context) {
  const { adminTelegramIds: adminIds } = client;
  if (!ctx?.msg?.from) return false;
  return adminIds.has(ctx.msg.from.id);
}
