import type { Context } from "#root/bot/context.js";
import { adminBoundary } from "#root/bot/helpers/admin-boundary.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import {
  SENDMESSAGE_CONVERSATION,
  sendmessageConversation,
} from "./conversation.js";

const composer = new Composer<Context>();

composer
  .use(sendmessageConversation())
  .command("sendmessage")
  .filter(
    adminBoundary(false),
    logHandle("command-sendmessage"),
    chatAction("typing"),
    (ctx) => ctx.conversation.enter(SENDMESSAGE_CONVERSATION)
  );

export { composer as sendMessageFeature };
