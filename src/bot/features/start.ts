import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";

const composer = new Composer<Context>();

composer.command("start", logHandle("command-start"), (ctx) => {
  return ctx.reply(ctx.t("welcome"));
});

export { composer as startFeature };
