import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

composer.on("message", logHandle("unhandled-message"), (ctx) => {
  if (ctx.msg.text?.startsWith("/")) {
    ctx.reply(ctx.t("unhandled.command"));
    return;
  }
  return ctx.reply(ctx.t("unhandled.text"));
});

composer.on("callback_query", logHandle("unhandled-callback-query"), (ctx) => {
  return ctx.answerCallbackQuery();
});

export { composer as unhandledFeature };
