import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { BotCommand } from "@grammyjs/types";
import { Composer } from "grammy";
import {
  getPrivateChatAdminCommands,
  getPrivateChatCommands,
} from "./setcommands.js";
import { checkIsAdmin } from "../helpers/admin-boundary.js";

const composer = new Composer<Context>();

function composeCommandList(commands: BotCommand[]) {
  return commands
    .map(({ command, description }) => `/${command} – ${description}`)
    .join("\n");
}

composer.command("help", logHandle("command-help"), async (ctx) => {
  const locale = await ctx.i18n.getLocale();
  const privateCommands = composeCommandList(getPrivateChatCommands(locale));
  const adminCommands =
    (await checkIsAdmin(ctx)) &&
    `\n*Admin commands*\n${composeCommandList(getPrivateChatAdminCommands(locale))}`;

  const message = [
    '<b>Official <a href="https://powerkids.edu.my">PowerKids Kindergarten</a> Telegram Bot</b>\n',
    privateCommands,
    adminCommands,
  ]
    .filter(Boolean)
    .join("\n");
  return ctx.reply(message);
});

export { composer as helpFeature };
