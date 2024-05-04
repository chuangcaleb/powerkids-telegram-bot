/* eslint-disable camelcase */
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { waitFor } from "~/bot/helpers/conversation/wait-for.js";
import { isAdmin } from "~/bot/helpers/filters/is-admin.js";
import { i18n } from "~/bot/i18n.js";
import { config } from "~/config.js";
import { client } from "~/lib/directus/client.js";

export const AUTHENTICATE_CONVERSATION = "authenticate";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  // Break if already an authenticated admin
  if (isAdmin(ctx)) {
    const admin = client.admins.find(({ telegram_ids }) =>
      telegram_ids?.includes(String(ctx.message?.from.id))
    );
    // ah lazy to enforce type, isAdmin should ensure admin?.first_name has a value
    await ctx.reply(`${admin?.first_name}, you are already an admin!`);
    return;
  }

  // Passphrase

  await ctx.reply("Enter admin passphrase");
  const passphraseCtx = await waitFor(conversation, "message:text");
  const passphrase = passphraseCtx.msg.text;

  if (passphrase !== config.ADMIN_PASSPHRASE) {
    await passphraseCtx.reply("Wrong passphrase! Terminated action.");
    return;
  }

  // Verify admin (db) ID — using first 8 chars

  await ctx.reply("Enter 8-character admin ID");
  const idCtx = await waitFor(conversation, "message:text");
  const id = idCtx.msg.text;
  // TODO: re-prompt if not 8-character alphanumeric

  const adminMatches = client.admins.filter((aId) => aId.id.slice(0, 8) === id);
  // Break on no match
  if (adminMatches.length === 0) {
    await idCtx.reply(
      "No ID match found. Terminated action. Please contact developer."
    );
    return;
  }
  // Break on possible ID collision
  if (adminMatches.length > 1) {
    await idCtx.reply(
      "ID collision. Terminated action. Please contact developer."
    );
    return;
  }

  await client.authenticateAdmin(adminMatches[0].id, idCtx.message.from.id);
  await idCtx.reply(
    "Successfully authenticated your Telegram account as an admin!"
  );
  // TODO: refresh admin list
}

export function authenticateConversation() {
  return createConversation(builder, AUTHENTICATE_CONVERSATION);
}
