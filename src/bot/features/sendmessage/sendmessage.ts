import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";
import { SENDMESSAGE_CONVERSATION } from "./sendmessage.conversation.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

// update this to cancel only in this convo
feature.command("cancel", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.reply("Leaving.");
});

feature.command("sendmessage", logHandle("command-sendmessage"), (ctx) => {
  return ctx.conversation.enter(SENDMESSAGE_CONVERSATION);
});

export { composer as sendmessageFeature };
