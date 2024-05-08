import { Conversation } from "@grammyjs/conversations";
import { FilterQuery } from "grammy";
import { Context } from "#root/bot/context.js";

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
  // Pass over to /cancel handler
  if (ctx.msg?.text === "/cancel") {
    await conversation.skip({ drop: false });
  }
  return ctx;
}
