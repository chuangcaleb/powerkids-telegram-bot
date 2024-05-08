import type { IncomingMessage, ServerResponse } from "node:http";
import { createBot } from "~/bot/index.js";
import { config } from "~/config.js";
import { createServer } from "~/server/index.js";

const bot = createBot(config.BOT_TOKEN);
const server = await createServer(bot);

// eslint-disable-next-line unicorn/no-anonymous-default-export
export default async (request: IncomingMessage, response: ServerResponse) => {
  await server.ready();
  server.server.emit("request", request, response);
};
