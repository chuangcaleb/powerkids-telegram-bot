import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { isAdmin } from "~/bot/helpers/filters/index.js";
import { logHandle } from "~/bot/helpers/logging.js";
import {
  SENDMESSAGE_CONVERSATION,
  sendmessageConversation,
} from "./sendmessage/conversation.js";
import { setCommandsHandler } from "./setcommands.js";

const composer = new Composer<Context>();

const feature = composer.filter(isAdmin);

feature.command(
  "setcommands",
  logHandle("command-setcommands"),
  chatAction("typing"),
  setCommandsHandler
);

feature
  .use(sendmessageConversation())
  .command(
    "sendmessage",
    logHandle("command-sendmessage"),
    chatAction("typing"),
    (ctx) => ctx.conversation.enter(SENDMESSAGE_CONVERSATION)
  );

export { composer as adminFeatures };
