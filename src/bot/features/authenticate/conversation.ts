import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { waitFor } from "~/bot/helpers/conversation/wait-for.js";
import { i18n } from "~/bot/i18n.js";
import { config } from "~/config.js";

export const AUTHENTICATE_CONVERSATION = "authenticate";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  await ctx.reply("Enter admin passphrase");
  const passphraseCtx = await waitFor(conversation, "message:text");
  const passphrase = passphraseCtx.msg.text;

  if (passphrase !== config.ADMIN_PASSPHRASE) {
    await passphraseCtx.reply("Wrong passphrase! Terminated action.");
    return;
  }

  await passphraseCtx.reply("Correct!");
}

export function authenticateConversation() {
  return createConversation(builder, AUTHENTICATE_CONVERSATION);
}
