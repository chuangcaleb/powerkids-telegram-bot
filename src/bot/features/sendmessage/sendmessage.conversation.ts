import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { waitFor } from "~/bot/helpers/wait-for.js";
import { i18n } from "~/bot/i18n.js";
import { retrieveQueryResult } from "./fuzzy.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

export function sendmessageConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n);

      // Get message
      await ctx.reply("Please tell me the message you want to send");
      const messageCtx = await waitFor(
        conversation,
        "message:text",
        "Please send text"
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const message = messageCtx.message?.text ?? "";

      // Get targets
      // TODO: allow comma/newline-delimited bulk input
      const students: [string, number][] = [];
      await ctx.reply("Please type the name of a student, or send /done");
      while (true) {
        const nameCtx = await waitFor(
          conversation,
          "message:text",
          "Please send text"
        );
        const name = nameCtx.message?.text ?? "";
        if (name === "/done") break;
        const queryResults = retrieveQueryResult(name);

        // if no results
        if (queryResults.length === 0) {
          ctx.reply("No match found. Try full name.");
          continue;
        }

        // if more than 1
        // TODO: handle multiple with further narrowing
        if (queryResults.length > 1) {
          const names = queryResults.map((r) => r.item[0] + r.score).join(", ");
          await ctx.reply(`many results (${names}), please retry`);
          continue;
        }

        // if exactly 1
        const result = queryResults[0].item;
        const oldStudentsString = students.map((s) => s[0]).join(", ");
        const reply = [
          `(${students.length + 1}) ${oldStudentsString} + <b>${result[0]}</b>`,
          `Enter another name, or send /done`,
        ].join("\n");
        await ctx.reply(reply, { parse_mode: "HTML" });
        students.push(result);
      }

      // await ctx.reply(`Sending to ${students.join(",")}: `);
      await ctx.reply(
        `Sending to ${students.map((s) => s[1]).join(",")}: ${message}`
      );
    },
    SENDMESSAGE_CONVERSATION
  );
}
