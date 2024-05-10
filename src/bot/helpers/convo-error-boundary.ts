import { logger } from "#root/logger.js";
import { BotError } from "grammy";

export function boundaryHandler(error: BotError) {
  logger.error(error);
}
