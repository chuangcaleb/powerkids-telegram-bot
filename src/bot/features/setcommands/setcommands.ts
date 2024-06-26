import type { Context } from "#root/bot/context.js";
import { i18n, isMultipleLocales } from "#root/bot/i18n.js";
import { BotCommand } from "@grammyjs/types";
import { CommandContext } from "grammy";

const DEFAULT_LANGUAGE_CODE = "en";

function getLanguageCommand(localeCode: string): BotCommand {
  return {
    command: "language",
    description: i18n.t(localeCode, "language_command.description"),
  };
}

export function getPrivateChatCommands(localeCode: string): BotCommand[] {
  return [
    {
      command: "start",
      description: i18n.t(localeCode, "start_command.description"),
    },
    {
      command: "help",
      description: "List available commands",
    },
  ];
}

export function getPrivateChatAdminCommands(localeCode: string): BotCommand[] {
  return [
    {
      command: "setcommands",
      description: i18n.t(localeCode, "setcommands_command.description"),
    },
    {
      command: "sendmsg",
      description: "Broadcast a message to the parents of selected students",
    },
    {
      command: "cancel",
      description: "Cancel the current action",
    },
  ];
}

function getPrivateAndLanguageCommands(localeCode: string): BotCommand[] {
  return [
    ...getPrivateChatCommands(localeCode),
    ...(isMultipleLocales ? [getLanguageCommand(DEFAULT_LANGUAGE_CODE)] : []),
  ];
}

function getAdminCommands(locale: string): BotCommand[] {
  return [
    ...getPrivateChatAdminCommands(locale),
    ...getPrivateAndLanguageCommands(locale),
  ];
}

export function setAdminCommands(ctx: Context, id: number) {
  return ctx.api.setMyCommands(getAdminCommands(DEFAULT_LANGUAGE_CODE), {
    scope: {
      type: "chat",
      chat_id: id,
    },
  });
}

// * No plans for group chat
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function getGroupChatCommands(localeCode: string): BotCommand[] {
//   return [];
// }

export async function setCommandsHandler(ctx: CommandContext<Context>) {
  // set private chat commands
  await ctx.api.setMyCommands(
    getPrivateAndLanguageCommands(DEFAULT_LANGUAGE_CODE),
    { scope: { type: "all_private_chats" } }
  );

  if (isMultipleLocales) {
    const requests = i18n.locales.map((code) =>
      ctx.api.setMyCommands(getPrivateAndLanguageCommands(code), {
        language_code: code,
        scope: { type: "all_private_chats" },
      })
    );

    await Promise.all(requests);
  }

  // * No plans for group chat
  // // set group chat commands
  // await ctx.api.setMyCommands(getGroupChatCommands(DEFAULT_LANGUAGE_CODE), {
  //   scope: { type: "all_group_chats" },
  // });
  //
  // if (isMultipleLocales) {
  //   const requests = i18n.locales.map((code) =>
  //     ctx.api.setMyCommands(getGroupChatCommands(code), {
  //       language_code: code,
  //       scope: { type: "all_group_chats" },
  //     })
  //   );

  //   await Promise.all(requests);
  // }

  // set private chat commands for admins
  // later: set languages according to locale

  return ctx.reply(ctx.t("admin.commands-updated"));
}
