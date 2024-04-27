import { Composer } from "grammy";
import { changeLanguageData } from "~/bot/callback-data/index.js";
import type { Context } from "~/bot/context.js";
import { logHandle } from "~/bot/helpers/logging.js";
import { i18n } from "~/bot/i18n.js";
import { createChangeLanguageKeyboard } from "~/bot/keyboards/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("language", logHandle("command-language"), async (ctx) => {
  return ctx.reply(ctx.t("language.select"), {
    reply_markup: await createChangeLanguageKeyboard(ctx),
  });
});

feature.callbackQuery(
  changeLanguageData.filter(),
  logHandle("keyboard-language-select"),
  async (ctx) => {
    const { code: languageCode } = changeLanguageData.unpack(
      ctx.callbackQuery.data
    );

    if (i18n.locales.includes(languageCode)) {
      await ctx.i18n.setLocale(languageCode);

      return ctx.editMessageText(ctx.t("language.changed"), {
        reply_markup: await createChangeLanguageKeyboard(ctx),
      });
    }
  }
);

export { composer as languageFeature };
