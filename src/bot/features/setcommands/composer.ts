import type { Context } from "#root/bot/context.js";
import { adminBoundary } from "#root/bot/helpers/admin-boundary.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import { setCommandsHandler } from "./setcommands.js";

const composer = new Composer<Context>();

composer
  .command("setcommands")
  .filter(
    adminBoundary(),
    logHandle("command-setcommands"),
    chatAction("typing"),
    setCommandsHandler
  );

export { composer as setCommandsFeature };
