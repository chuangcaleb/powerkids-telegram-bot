import { ErrorHandler } from "grammy";
import type { Context } from "~/bot/context.js";
import { getUpdateInfo } from "~/bot/helpers/logging.js";
import { ExitConversationError } from "./conversation/exit-convo-error.js";

export const errorHandler: ErrorHandler<Context> = (error) => {
  const { ctx } = error;
  if (error.error instanceof ExitConversationError) {
    const errorMessage = error.error.conversationError;
    const message = [
      !!errorMessage && errorMessage,
      "Terminated action. What else can I do for you? (Enter /help for options)",
    ]
      .filter(Boolean)
      .join("\n");

    ctx.reply(message);
    ctx.conversation.exit();
    return;
  }

  ctx.logger.error({
    err: error.error,
    update: getUpdateInfo(ctx),
  });
};
