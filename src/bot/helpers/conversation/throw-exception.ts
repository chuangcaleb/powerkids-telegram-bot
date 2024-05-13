import { Context } from "#root/bot/context.js";
import { ExitConversationError } from "./exit-convo-error.js";

export function throwException(ctx: Context, logMessage: string): never {
  if (logMessage) ctx.logger.error(logMessage);
  throw new ExitConversationError(ctx.t("generic_error"));
}

export function catchException(ctx: Context): (error: any) => never {
  return (error) => {
    throwException(ctx, error.message ?? error.errors[0].message);
  };
}
