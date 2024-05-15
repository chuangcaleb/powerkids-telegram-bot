import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { handleDeepLink } from "./handle-deep-link.js";

const composer = new Composer<Context>();

composer.command("start", logHandle("command-start"), handleDeepLink, (ctx) =>
  ctx.reply(ctx.t("welcome"))
);

export { composer as startFeature };
