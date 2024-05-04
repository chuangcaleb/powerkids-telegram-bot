import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";
import { REGISTER_CONVERSATION, registerConversation } from "./conversation.js";

const composer = new Composer<Context>();

composer
  .use(registerConversation())
  .command(
    "register",
    logHandle("command-register"),
    chatAction("typing"),
    (ctx) => ctx.conversation.enter(REGISTER_CONVERSATION)
  );

export { composer as registerFeature };
