import { Context } from "#root/bot/context.js";
import { validateAdmin } from "#root/lib/directus/methods/validate-admin.js";

export async function checkIsAdmin(ctx: Context) {
  const sender = ctx.msg?.from?.id;
  if (!sender) return false;
  const admins = await validateAdmin(sender);
  return admins.length > 0;
}

// isAdminTrue controls whether to flip the result
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
