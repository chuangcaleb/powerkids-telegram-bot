import { Composer } from "grammy";
import type { Context } from "~/bot/context.js";
import { isMultipleLocales } from "../i18n.js";
import { adminFeatures } from "./admin/index.js";
import { helpFeature } from "./help.js";
import { languageFeature } from "./language.js";
import { startFeature } from "./start.js";

export * from "./admin/index.js";
export * from "./language.js";
export * from "./unhandled.js";
export * from "./start.js";

const composer = new Composer<Context>();

const features = composer.chatType("private");

features.use(startFeature);
features.use(helpFeature);
features.use(adminFeatures);
features.use();

if (isMultipleLocales) {
  features.use(languageFeature);
}

export { composer as features };
