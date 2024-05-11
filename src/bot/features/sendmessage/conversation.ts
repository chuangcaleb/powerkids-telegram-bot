import { Context } from "#root/bot/context.js";
import { catchException } from "#root/bot/helpers/conversation/throw-exception.js";
import { waitFor } from "#root/bot/helpers/conversation/wait-for.js";
import { i18n } from "#root/bot/i18n.js";
import { getStudents } from "#root/lib/directus/methods/get-students.js";
import { Student } from "#root/lib/directus/types-gen.js";
import { Conversation, createConversation } from "@grammyjs/conversations";
import { getFilteredRegistry } from "./search/get-filtered-registry.js";
import { pickSubstring } from "./search/pick-substring.js";
import { getQueryResults } from "./search/query.js";
import { getStudentRegisteredParents } from "./send/check-registered.js";
import { processPromiseResults } from "./send/feedback.js";
import { pivot } from "./send/pivot.js";
import { SelectedStudent } from "./types.js";

export const SENDMESSAGE_CONVERSATION = "sendmessage";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);

  // Get message
  await ctx.reply("Enter the message you want to send");
  const messageCtx = await waitFor(conversation, "message:text");
  const message = messageCtx.msg.text;
  await messageCtx.reply("↑ Forwarding this message ↑", {
    reply_parameters: { message_id: messageCtx.msg.message_id },
  });

  // Get targets
  // TODO: allow comma/newline-delimited bulk input
  const selectedStudents: SelectedStudent[] = [];
  await messageCtx.reply(
    `Next, enter a student's name, and send /done when you have listed them all`
  );

  const students = await getStudents().catch(catchException(ctx));

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
    const registry = getFilteredRegistry(students, selectedStudents);
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
    const parents = await getStudentRegisteredParents(result).catch(
      catchException(ctx)
    );
    if (parents.length === 0) {
      await nameCtx.reply(
        `<b>${result.name}</b> no registered Telegram account to send to.\nEnter another name, or send /done`
      );
      continue;
    }
    // If has telegram_ids, then add to list
    const displaySelectedStudents = [
      ...selectedStudents.map((s) => s.student),
      { ...result, name: `<b>${result.name}</b>` },
    ];
    selectedStudents.push({ student: result, parents });

    const studentsString = displaySelectedStudents
      .map((s) => s.name)
      .join(", ");
    const selectionString = `(x${selectedStudents.length}) ${studentsString}`;
    const reply = `${selectionString}\nEnter another name, or send /done`;
    await nameCtx.reply(reply);
  }

  // send
  const targets = pivot(selectedStudents);
  const targetTelegramIds = Object.keys(targets);

  const results = await Promise.allSettled(
    targetTelegramIds.map((targetId) => ctx.api.sendMessage(targetId, message))
  );
  const metaResults = results.map((result, index) => ({
    result,
    targetMeta: targets[targetTelegramIds[index]],
  }));

  const feedback = processPromiseResults(metaResults);

  await ctx.reply(feedback);
  await ctx.reply("End of action.");
}

export function sendmessageConversation() {
  return createConversation(builder, SENDMESSAGE_CONVERSATION);
}
