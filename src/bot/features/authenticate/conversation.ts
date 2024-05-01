import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { i18n } from "~/bot/i18n.js";

export const AUTHENTICATE_CONVERSATION = "authenticate";

export function authenticateConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n);

      // Get message
      await ctx.reply("Enter your NRIC number");
    },
    AUTHENTICATE_CONVERSATION
  );
}
