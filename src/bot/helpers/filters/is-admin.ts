import { Context } from "~/bot/context.js";
import { directus } from "~/lib/directus/client.js";

export async function isAdmin(ctx: Context) {
  const { adminIds } = directus;
  if (!ctx?.msg?.from) return false;
  return adminIds.has(ctx.msg.from.id);
}
