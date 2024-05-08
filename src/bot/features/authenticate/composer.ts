import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  AUTHENTICATE_CONVERSATION,
  authenticateConversation,
} from "./conversation.js";

const composer = new Composer<Context>();

composer
  .use(authenticateConversation())
  .command(
    "authenticate",
    logHandle("command-authenticate"),
    chatAction("typing"),
    (ctx) => ctx.conversation.enter(AUTHENTICATE_CONVERSATION)
  );

export { composer as authFeature };
