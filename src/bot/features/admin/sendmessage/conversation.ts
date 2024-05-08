import { Context } from "#root/bot/context.js";
import { throwException } from "#root/bot/helpers/conversation/throw-exception.js";
import { waitFor } from "#root/bot/helpers/conversation/wait-for.js";
import { i18n } from "#root/bot/i18n.js";
import { client } from "#root/lib/directus/client.js";
import { Student } from "#root/lib/directus/types-gen.js";
import { Conversation, createConversation } from "@grammyjs/conversations";
import { getFilteredRegistry } from "./search/get-filtered-registry.js";
import { pickSubstring } from "./search/pick-substring.js";
import { getQueryResults } from "./search/query.js";

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
  await messageCtx.reply("↑ Forwarding this message ↑", {
    reply_parameters: { message_id: messageCtx.msg.message_id },
  });

  // Get targets
  // TODO: allow comma/newline-delimited bulk input
  const selectedStudents: Student[] = [];
  await messageCtx.reply(
    `Next, enter a student's name, and send /done when you have listed them all`
  );

  while (true) {
    const nameCtx = await waitFor(conversation, "message:text");
    const name = nameCtx.message.text;

    // If /done, try breaking loop
    if (name === "/done") {
      if (selectedStudents.length > 0) break;
      await nameCtx.reply(
        "Enter at least 1 student's name before sending /done"
      );
      continue;
    }

    // Query for students
    const registry = getFilteredRegistry(selectedStudents);
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

    // if exactly 1, add to list, and then re-prompt
    const result = queryResults[0];
    // if no telegram_ids, then skip
    const telegramIds = result.telegram_ids;
    if (!telegramIds || telegramIds.length === 0) {
      await nameCtx.reply(
        `<b>${result.name}</b> no registered Telegram account to send to.\nEnter another name, or send /done`
      );
      continue;
    }
    // If has telegram_ids, then add to list
    const displaySelectedStudents = [
      ...selectedStudents,
      { ...result, name: `<b>${result.name}</b>` },
    ];
    selectedStudents.push(result);

    const studentsString = displaySelectedStudents
      .map((s) => s.name)
      .join(", ");
    const selectionString = `(x${selectedStudents.length}) ${studentsString}`;
    const reply = `${selectionString}\nEnter another name, or send /done`;
    await nameCtx.reply(reply);
  }

  // send
  const targets = [...new Set(selectedStudents.flatMap((s) => s.telegram_ids))]
    // could've used a .filter(Boolean) but typescript is angy
    .filter(<T>(value: T): value is NonNullable<T> => value !== null)
    .filter((string) => string !== "");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await Promise.allSettled(
    targets.map((target) => ctx.api.sendMessage(target, message))
  );
}

export function sendmessageConversation() {
  return createConversation(builder, SENDMESSAGE_CONVERSATION);
}
