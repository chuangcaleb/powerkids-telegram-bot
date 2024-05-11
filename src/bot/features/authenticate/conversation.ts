/* eslint-disable camelcase */
import { Context } from "#root/bot/context.js";
import { checkIsAdmin } from "#root/bot/helpers/admin-boundary.js";
import { waitFor } from "#root/bot/helpers/conversation/wait-for.js";
import { i18n } from "#root/bot/i18n.js";
import { config } from "#root/config.js";
import { client } from "#root/lib/directus/client.js";
import { authenticateAdmin } from "#root/lib/directus/methods/authenticate-admin.js";
import { readUsers } from "@directus/sdk";
import { Conversation, createConversation } from "@grammyjs/conversations";

export const AUTHENTICATE_CONVERSATION = "authenticate";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  // FIXME
  // if (client.admins.length === 0)
  //   throwException(ctx, "Attempted authenticate w/ empty admins list");

  // FIXME Break if already an authenticated admin
  if (await checkIsAdmin(ctx)) {
    // const admin = client.admins.find(({ telegram_ids }) =>
    //   telegram_ids?.includes(String(ctx.message?.from.id))
    // );
    // // ah lazy to enforce type, isAdmin should ensure admin?.first_name has a value
    await ctx.reply(`You are already an admin!`);
    // await ctx.reply(`${admin?.first_name}, you are already an admin!`);
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
  const id = idCtx.msg.text;

  const adminMatches = await client.request(
    readUsers({
      fields: ["id", "first_name"],
      filter: { id: { _eq: id } },
    })
  );

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

  const admin = adminMatches[0];
  await authenticateAdmin(admin.id, idCtx.message.from.id);

  await idCtx.reply(
    `Hello, ${admin.first_name}. Successfully authenticated your Telegram account as an admin! Please Clear Chat History to delete the admin passphrase from it.`
  );
}

export function authenticateConversation() {
  return createConversation(builder, AUTHENTICATE_CONVERSATION);
}
