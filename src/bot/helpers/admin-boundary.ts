import { Context } from "#root/bot/context.js";
import { client } from "#root/lib/directus/client.js";
import { readUsers } from "@directus/sdk";
import { NextFunction } from "grammy";

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

export async function checkIsAdmin(ctx: Context, throwError: boolean = false) {
  try {
    return !!(await getCurrentAdmin(ctx));
  } catch (error) {
    if (throwError) throw error;
    return false;
  }
}

// shouldAdmin controls whether to flip the result
export function adminBoundary(shouldAdmin: boolean = true) {
  return async (ctx: Context, next: NextFunction) => {
    const isAdmin = await checkIsAdmin(ctx, true);
    // if unauthorized, drop
    if (isAdmin !== shouldAdmin) {
      ctx.logger.warn(ctx.message?.from, `Unauthorized attempt`);
      ctx.reply("You are unauthorized to perform this action");
      return;
    }

    // else, next()
    await next();
  };
}
