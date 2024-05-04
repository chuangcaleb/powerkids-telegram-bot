import { ErrorHandler } from "grammy";
import type { Context } from "~/bot/context.js";
import { getUpdateInfo } from "~/bot/helpers/logging.js";
import { ExitConversationError } from "./conversation/exit-convo-error.js";

export const errorHandler: ErrorHandler<Context> = (error) => {
  const { ctx } = error;
  if (error.error instanceof ExitConversationError) {
    const message =
      `<code>${error.message}</code>\n` +
      "Terminated action. What else can I do for you? (Enter /help for options)";

    ctx.reply(message);
    ctx.conversation.exit();
    return;
  }

  ctx.logger.error({
    err: error.error,
    update: getUpdateInfo(ctx),
  });
};
