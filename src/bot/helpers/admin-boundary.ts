import { Context } from "#root/bot/context.js";

export function adminBoundary(isAdmin: boolean = true) {
  return async (ctx: Context) => {
    if (isAdmin) return true;
    await ctx.reply("Not an admin!");
    return false;
  };
}
