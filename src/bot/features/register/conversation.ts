/* eslint-disable camelcase */
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "~/bot/context.js";
import { throwException } from "~/bot/helpers/conversation/throw-exception.js";
import { waitFor } from "~/bot/helpers/conversation/wait-for.js";
import { stripAlphanumeric } from "~/bot/helpers/strip-alphanum.js";
import { i18n } from "~/bot/i18n.js";
import { client } from "~/lib/directus/client.js";

export const REGISTER_CONVERSATION = "register";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);
  // TODO: passphrase

  // catch empty students list
  if (client.students.length === 0)
    throwException(ctx, "Attempted register w/ empty admins list");

  // NRIC
  await ctx.reply("Enter your child's National IC number");
  const icCtx = await waitFor(conversation, "message:text");
  const rawIc = icCtx.msg.text;
  const strippedIc = stripAlphanumeric(rawIc);

  const student = client.students.find(
    (s) => stripAlphanumeric(s.ic) === strippedIc
  );
  // Break on no match
  if (!student) {
    await icCtx.reply(
      "No IC number match found. Terminated action. Please contact your school as we may not have your child's IC in our records."
    );
    return;
  }

  // TODO: break if already registered

  await client.registerParent(student.ic, icCtx.message.from.id);
  await icCtx.reply(
    `IC matches <b>${student.name}</b>! Your Telegram account is now verified and will receive notifications for this child. If you have other children, you will have to /register them separately.`
  );
}

export function registerConversation() {
  return createConversation(builder, REGISTER_CONVERSATION);
}
