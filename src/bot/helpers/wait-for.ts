import { Conversation } from "@grammyjs/conversations";
import { FilterQuery } from "grammy";
import { Context } from "~/bot/context.js";

export async function waitFor<Q extends FilterQuery>(
  conversation: Conversation<Context>,
  filterQuery: Q | Q[],
  otherwiseReply?: string
) {
  return conversation.waitFor(filterQuery, {
    otherwise: async (ctx) => {
      if (otherwiseReply) await ctx.reply(otherwiseReply);
      await conversation.skip({ drop: true });
    },
  });
}
