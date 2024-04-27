import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { i18n } from "~/bot/i18n.js";
import { REGISTRY } from "./mock-data.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

export function sendmessageConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n);

      // Get message
      await ctx.reply("Please tell me the message you want to send");

      const messageCtx = await conversation.waitFor("message::bold", {
        otherwise: async (ctxx) => {
          ctxx.reply("please send bold");
          await conversation.skip({ drop: true });
        },
      });
      const message = messageCtx.message?.text ?? "";

      // Get targets
      await ctx.reply("Please select the students");
      ctx.api.sendMessage(REGISTRY.Chuang, message);
    },
    SENDMESSAGE_CONVERSATION
  );
}
