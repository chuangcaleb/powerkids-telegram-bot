import { Context } from "#root/bot/context.js";
import { logger } from "#root/logger.js";
import { ExitConversationError } from "./exit-convo-error.js";

export function throwException(ctx: Context, logMessage: string): never {
  if (logMessage) logger.warn(logMessage);
  throw new ExitConversationError(ctx.t("generic_error"));
}

export function catchException(ctx: Context): (error: Error) => never {
  return (error) => throwException(ctx, error.message);
}
