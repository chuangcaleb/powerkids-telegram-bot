import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { throwException } from "~/bot/helpers/conversation/throw-exception.js";
import { waitFor } from "~/bot/helpers/conversation/wait-for.js";
import { i18n } from "~/bot/i18n.js";
import { client } from "~/lib/directus/client.js";
import { Student } from "~/lib/directus/types-gen.js";
import { getFilteredRegistry } from "./get-filtered-registry.js";
import { pickSubstring } from "./pick-substring.js";
import { getQueryResults } from "./query.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  // catch empty students list
  const { students } = client;
  if (students.length === 0)
    throwException(ctx, "Attempted sendmessage w/ empty students list");

  // Get message
  await ctx.reply("Enter the message you want to send");
  const messageCtx = await waitFor(conversation, "message:text");
  const message = messageCtx.msg.text;

  // Get targets
  // TODO: allow comma/newline-delimited bulk input
  const studentSearchResults: Student[] = [];
  await messageCtx.reply("↑ Forwarding this message ↑", {
    reply_parameters: { message_id: messageCtx.msg.message_id },
  });
  await messageCtx.reply("Next, enter the name of a student, or send /done");

  while (true) {
    const nameCtx = await waitFor(conversation, "message:text");
    const name = nameCtx.message.text;

    // If /done, try breaking loop
    if (name === "/done") {
      if (studentSearchResults.length > 0) break;
      await nameCtx.reply(
        "Enter at least 1 student's name before sending /done"
      );
      continue;
    }

    // Query for students
    const registry = getFilteredRegistry(studentSearchResults);
    // eslint-disable-next-line unicorn/no-array-reduce
    const queryResults = [getQueryResults, pickSubstring].reduce(
      (previous, current) =>
        current<Student>(previous, name, (result) => result.name),
      registry
    );

    // if no results, prompt retry
    if (queryResults.length === 0) {
      await nameCtx.reply(
        "No new close match found. If record does not exist, please contact the developer."
      );
      continue;
    }

    // if more than 1, prompt retry
    // TODO: handle multiple with further narrowing
    if (queryResults.length > 1) {
      const names = queryResults.map((r) => r.name).join(", ");
      await nameCtx.reply(
        `More than one result found, please narrow your search\n<i>Possibly: ${names}</i>`
      );
      continue;
    }

    // if exactly 1, add to list
    const result = queryResults[0];
    const oldStudentsString = studentSearchResults
      .map((s) => s.name)
      .join(", ");
    const studentsList = `(x${studentSearchResults.length + 1}) ${oldStudentsString}${studentSearchResults.length > 0 ? ", " : ""}<b>${result.name}</b>`;
    const reply = `${studentsList}\nEnter another name, or send /done`;
    await nameCtx.reply(reply);
    studentSearchResults.push(result);
  }

  // send
  const targets = studentSearchResults
    .flatMap((s) => s.telegram_ids)
    // could've used a .filter(Boolean) but typescript is angy
    .filter(<T>(value: T): value is NonNullable<T> => value !== null);
  await ctx.reply(`Sending to ${targets.join(",")}`);
  await ctx.reply(`The message is:\n\n${message}`);
}

export function sendmessageConversation() {
  return createConversation(builder, SENDMESSAGE_CONVERSATION);
}
