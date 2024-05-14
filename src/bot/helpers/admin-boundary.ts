import { Context } from "#root/bot/context.js";
import { client } from "#root/lib/directus/client.js";
import { readUsers } from "@directus/sdk";

export async function getCurrentAdmin(ctx: Context) {
  const sender = ctx.msg?.from?.id;
  if (!sender) return false;
  const admins = await client.request(
    readUsers({
      fields: ["first_name", "telegram_ids"],
      filter: {
        telegram_ids: {
          // @ts-expect-error: Ah, CSV field is stored as plain string. Typechecking doesn't allow certain array queries
          // https://github.com/directus/directus/issues/22176
          _contains: String(sender),
        },
      },
      limit: 1,
    })
  );
  if (!admins) return;
  return admins[0];
}

export async function checkIsAdmin(ctx: Context) {
  return !!(await getCurrentAdmin(ctx));
}

// shouldAdmin controls whether to flip the result
export function adminBoundary(shouldAdmin: boolean = true) {
  return async (ctx: Context) => {
    const isAdmin = await checkIsAdmin(ctx);
    // if unauthorized, drop
    if (!isAdmin && !shouldAdmin) {
      ctx.logger.warn(ctx.message?.from, `Unauthorized attempt`);
      ctx.reply("Not allowed");
    }
    // Only return true if matches (XAND)
    return isAdmin === shouldAdmin;
  };
}
