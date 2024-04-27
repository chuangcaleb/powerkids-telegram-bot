import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";
import { SENDMESSAGE_CONVERSATION } from "../conversations/sendmessage.conversation.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("sendmessage", logHandle("command-sendmessage"), (ctx) => {
  return ctx.conversation.enter(SENDMESSAGE_CONVERSATION);
});

feature.command("cancel", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.reply("Back to root");
});

export { composer as sendmessageFeature };
