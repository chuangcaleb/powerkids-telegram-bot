import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isMultipleLocales } from "../i18n.js";
import { adminFeatures } from "./admin/composer.js";
import { authFeature } from "./authenticate/composer.js";
import { cancelFeature } from "./cancel.js";
import { helpFeature } from "./help.js";
import { languageFeature } from "./language.js";
import { registerFeature } from "./register/composer.js";
import { startFeature } from "./start.js";
import { unhandledFeature } from "./unhandled.js";

export * from "./admin/composer.js";
export * from "./language.js";
export * from "./start.js";
export * from "./unhandled.js";

const composer = new Composer<Context>();

const features = composer.chatType("private");

features.use(startFeature);
features.use(helpFeature);
features.use(authFeature);
features.use(registerFeature);

// Put admin features later to reduce checks for isAdmin
features.use(adminFeatures);

// must be the last handler
features.use(cancelFeature);
features.use(unhandledFeature);

if (isMultipleLocales) {
  features.use(languageFeature);
}

export { composer as features };
