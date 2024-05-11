/* eslint-disable camelcase */
import { Context } from "#root/bot/context.js";
import { getCurrentAdmin } from "#root/bot/helpers/admin-boundary.js";
import { waitFor } from "#root/bot/helpers/conversation/wait-for.js";
import { i18n } from "#root/bot/i18n.js";
import { config } from "#root/config.js";
import { client } from "#root/lib/directus/client.js";
import { authenticateAdmin } from "#root/lib/directus/methods/authenticate-admin.js";
import { readUser } from "@directus/sdk";
import { Conversation, createConversation } from "@grammyjs/conversations";

export const AUTHENTICATE_CONVERSATION = "authenticate";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  // FIXME
  // if (client.admins.length === 0)
  //   throwException(ctx, "Attempted authenticate w/ empty admins list");

  // FIXME Break if already an authenticated admin
  const currentAdmin = await getCurrentAdmin(ctx);
  if (currentAdmin) {
    await ctx.reply(`${currentAdmin.first_name}, you are already an admin!`);
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

  // Verify admin (db) ID
  await ctx.reply("Enter your admin ID");
  const idCtx = await waitFor(conversation, "message:text");
  const databaseId = idCtx.msg.text;

  const adminMatch = await client
    .request(readUser(databaseId, { fields: ["first_name"] }))
    // FIXME: annotate for FORBIDDEN matches
    .catch(() => {});

  // Break on no match
  if (!adminMatch) {
    await idCtx.reply(
      "No ID match found. Terminated action. Please contact developer."
    );
    return;
  }

  await authenticateAdmin(databaseId, idCtx.message.from.id);

  await idCtx.reply(
    `Hello, ${adminMatch.first_name}. Successfully authenticated your Telegram account as an admin! Please Clear Chat History to delete the admin passphrase from it.`
  );
}

export function authenticateConversation() {
  return createConversation(builder, AUTHENTICATE_CONVERSATION);
}
