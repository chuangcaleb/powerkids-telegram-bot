import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { i18n } from "~/bot/i18n.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

export function sendmessageConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n);

      await ctx.reply("Please tell me the message you want to send");

      ctx = await conversation.waitFor("message::bold", {
        otherwise: async (ctxx) => {
          ctxx.reply("please send bold");
          await conversation.skip({ drop: true });
        },
      });
      ctx.reply(ctx.message?.text as string);

      // while (true) {
      //   ctx = await conversation.wait();

      //   if (ctx.has("message:text")) {
      //     ctx.chatAction = "typing";
      //     await conversation.sleep(1000);

      //     await ctx.reply(`Hello, ${ctx.message.text}!`);
      //   } else {
      //     await ctx.reply("Please send me your name");
      //   }
      // }
    },
    SENDMESSAGE_CONVERSATION
  );
}
