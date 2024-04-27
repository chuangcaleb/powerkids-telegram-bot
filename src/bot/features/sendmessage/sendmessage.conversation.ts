import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { i18n } from "~/bot/i18n.js";
import { retrieveQueryResult } from "./fuzzy.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

export function sendmessageConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n);

      // Get message
      await ctx.reply("Please tell me the message you want to send");

      const messageCtx = await conversation.waitFor("message:text", {
        otherwise: async (ctxx) => {
          await ctxx.reply("please send bold");
          await conversation.skip({ drop: true });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const message = messageCtx.message?.text ?? "";

      // Get targets
      await ctx.reply("Please type the name of a student");
      const nameCtx = await conversation.waitFor("message:text", {
        otherwise: async (ctxx) => {
          await ctxx.reply("please send text");
          await conversation.skip({ drop: true });
        },
      });
      const name = nameCtx.message?.text ?? "";
      const queryResults = retrieveQueryResult(name);
      if (queryResults.length === 0) ctx.reply("no results");
      await ctx.reply(queryResults[0].item[0]);
    },
    SENDMESSAGE_CONVERSATION
  );
}
