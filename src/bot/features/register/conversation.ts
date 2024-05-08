/* eslint-disable camelcase */
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Context } from "#root/bot/context.js";
import { throwException } from "#root/bot/helpers/conversation/throw-exception.js";
import { waitFor } from "#root/bot/helpers/conversation/wait-for.js";
import { stripAlphanumeric } from "#root/bot/helpers/strip-alphanum.js";
import { i18n } from "#root/bot/i18n.js";
import { client } from "#root/lib/directus/client.js";

export const REGISTER_CONVERSATION = "register";

async function builder(conversation: Conversation<Context>, ctx: Context) {
  await conversation.run(i18n);
  // TODO: passphrase

  // catch empty students list
  if (client.students.length === 0)
    throwException(ctx, "Attempted register w/ empty students list");
  if (client.parents.length === 0)
    throwException(ctx, "Attempted register w/ empty parents list");

  // No sender
  const sender = ctx.msg?.from?.id;
  if (!sender) {
    throwException(ctx, "No message sender");
    return;
  }

  // break if already registered
  const existingParent = client.parents.find(
    (p) => Number(p.telegram_id) === sender
  );

  if (existingParent) {
    ctx.reply(
      `You are already registered as ${existingParent.name}. Terminated action.`
    );
    return;
  }
  // prompt enter
  await ctx.reply("Enter your mobile number");
  const mobileCtx = await waitFor(conversation, "message:text");
  const rawMobile = mobileCtx.msg.text;
  const strippedMobile = stripAlphanumeric(rawMobile);

  const parent = client.parents.find(
    (s) => stripAlphanumeric(s.mobile) === strippedMobile
  );

  // Break on no match
  if (!parent) {
    await mobileCtx.reply(
      "No mobile number match found. Terminated action. Please contact your school as we may not have your mobile in our records."
    );
    return;
  }

  const parentKey = parent.gender === "male" ? "father_to" : "mother_to";

  const students = client.students.filter((s) =>
    parent[parentKey].includes(s.ic)
  );

  await ctx.reply(
    `Hello, ${parent.name}, parent of ${students.map((s) => s.name).join(", ")}`
  );

  await client.registerParent(parent.ic, sender);
  await mobileCtx.reply(
    `Your Telegram account is now verified and will receive notifications for this child.`
  );

  client.update();
}

export function registerConversation() {
  return createConversation(builder, REGISTER_CONVERSATION);
}
