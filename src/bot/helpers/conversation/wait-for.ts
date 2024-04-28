import { Conversation } from "@grammyjs/conversations";
import { FilterQuery } from "grammy";
import { Context } from "~/bot/context.js";
import { ExitConversationError } from "./exit-convo-error.js";

export async function waitFor<Q extends FilterQuery>(
  conversation: Conversation<Context>,
  filterQuery: Q | Q[],
  otherwiseReply?: string
) {
  const ctx = await conversation.waitFor(filterQuery, {
    otherwise: async (oCtx) => {
      if (otherwiseReply) await oCtx.reply(otherwiseReply);
      await conversation.skip({ drop: true });
    },
  });
  // Terminate conversation
  if (ctx.msg?.text === "/cancel") {
    throw new ExitConversationError();
  }
  // if (matchFilter("::bot_command")(ctx)) {
  //   // Terminate conversation
  //   if (ctx.msg?.text === "/cancel") {
  //     throw new ExitConversationError();
  //   }

  //   // Any other command
  //   if (otherwiseReply) await ctx.reply(otherwiseReply);
  //   await ctx.reply(
  //     `Invalid command during this action.\nEnter /cancel to terminate and perform other actions instead!`
  //   );
  //   await conversation.skip({ drop: true });
  // }
  return ctx;
}
