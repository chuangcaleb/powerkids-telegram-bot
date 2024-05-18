import type { Context } from "#root/bot/context.js";
import { Composer } from "grammy";
import { isMultipleLocales } from "../i18n.js";
import { cancelFeature } from "./cancel.js";
import { helpFeature } from "./help.js";
import { languageFeature } from "./language.js";
import { sendMessageFeature } from "./sendmessage/composer.js";
import { setCommandsFeature } from "./setcommands/composer.js";
import { startFeature } from "./start/composer.js";
import { unhandledFeature } from "./unhandled.js";

const composer = new Composer<Context>();

const features = composer.chatType("private");

features.use(startFeature);
features.use(helpFeature);
features.use(setCommandsFeature);
features.use(sendMessageFeature);

// must be the last handler
features.use(cancelFeature);
features.use(unhandledFeature);

if (isMultipleLocales) {
  features.use(languageFeature);
}

export { composer as features };
