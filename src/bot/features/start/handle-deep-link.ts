import { Context } from "#root/bot/context.js";
import { getCurrentAdmin } from "#root/bot/helpers/admin-boundary.js";
import { catchException } from "#root/bot/helpers/conversation/throw-exception.js";
import { config } from "#root/config.js";
import { client } from "#root/lib/directus/client.js";
import { authenticateAdmin } from "#root/lib/directus/methods/authenticate-admin.js";
import { readUser } from "@directus/sdk";
import { NextFunction } from "grammy";
import { setAdminCommands } from "../setcommands/setcommands.js";

const splitAt = (xs: string, index: number) => [
  xs.slice(0, index),
  xs.slice(index),
];

// TODO: add de/encryption to payload
export async function handleDeepLink(ctx: Context, next: NextFunction) {
  const payload = ctx.match;

  // if no match segments, then jump over this middleware step
  if (!payload || typeof payload !== "string" || !ctx.message) {
    await next();
    return;
  }

  const [adminId, passphrase] = splitAt(payload, 36);

  if (!passphrase || !adminId) {
    await next();
    return;
  }

  // Check for passphrase
  if (passphrase !== config.ADMIN_PASSPHRASE) {
    await ctx.reply("Incorrect passphrase! Terminated action.");
    return;
  }

  // Check for existing admin
  const currentAdmin = await getCurrentAdmin(ctx).catch(catchException(ctx));
  if (currentAdmin) {
    await ctx.reply(`${currentAdmin.first_name}, you are already an admin!`);
    return;
  }

  // Search for admin
  const adminMatch = await client
    .request(readUser(adminId, { fields: ["first_name"] }))
    // FIXME: annotate for FORBIDDEN matches
    .catch(() => {});

  // Break on no match
  if (!adminMatch) {
    await ctx.reply(
      "No ID match found. Terminated action. Please contact developer."
    );
    return;
  }

  // On success:
  await authenticateAdmin(adminId, ctx.message.from.id);
  await setAdminCommands(ctx, ctx.message.from.id);

  await ctx.reply(
    `Hello, ${adminMatch.first_name}. Successfully authenticated your Telegram account as an admin!`
  );
}
