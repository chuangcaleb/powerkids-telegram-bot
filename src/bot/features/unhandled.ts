import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";

const composer = new Composer<Context>();

composer.on("message", logHandle("unhandled-message"), (ctx) => {
  return ctx.reply(ctx.t("unhandled"));
});

composer.on("callback_query", logHandle("unhandled-callback-query"), (ctx) => {
  return ctx.answerCallbackQuery();
});

export { composer as unhandledFeature };
