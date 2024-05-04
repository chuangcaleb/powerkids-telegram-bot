import { Context } from "~/bot/context.js";
import { logger } from "~/logger.js";
import { ExitConversationError } from "./exit-convo-error.js";

export function catchGenericException(ctx: Context, message: string) {
  ctx.reply(ctx.t("generic_error"));
  if (message) logger.warn(message);
  throw new ExitConversationError();
}
