import { BotCommand } from "@grammyjs/types";
import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";
import {
  getPrivateChatAdminCommands,
  getPrivateChatCommands,
} from "./admin/setcommands.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

function composeCommandList(commands: BotCommand[]) {
  return commands
    .map(({ command, description }) => `/${command} – ${description}`)
    .join("\n");
}

feature.command("help", logHandle("command-start"), async (ctx) => {
  const locale = await ctx.i18n.getLocale();
  const privateCommands = getPrivateChatCommands(locale);
  const adminCommands = getPrivateChatAdminCommands(locale);
  const message = [
    "Official Telegram bot of [PowerKids Kindergarten](https://powerkids.edu.my)\n",
    composeCommandList(privateCommands),
    !!adminCommands &&
      `\n*Admin commands*\n${composeCommandList(adminCommands)}`,
  ]
    .filter(Boolean)
    .join("\n");
  return ctx.reply(message, { parse_mode: "MarkdownV2" });
});

export { composer as helpFeature };
