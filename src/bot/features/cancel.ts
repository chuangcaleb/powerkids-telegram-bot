import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";

const composer = new Composer<Context>();

composer.command("cancel", logHandle("cancel-message"), async (ctx) => {
  const conversationId = Object.keys(await ctx.conversation.active())[0];

  if (!conversationId) {
    await ctx.reply("No ongoing action to cancel! (Enter /help for options)");
    return;
  }

  await ctx.reply(
    `Terminated <code>/${conversationId}</code> action.\n` +
      "What else can I do for you? (Enter /help for options)"
  );
  await ctx.conversation.exit();
});

export { composer as cancelFeature };
