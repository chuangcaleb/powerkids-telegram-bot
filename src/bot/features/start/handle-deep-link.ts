import { Context } from "#root/bot/context.js";
import { config } from "#root/config.js";
import { client } from "#root/lib/directus/client.js";
import { authenticateAdmin } from "#root/lib/directus/methods/authenticate-admin.js";
import { splitAt } from "#root/lib/string.js";
import { readItem, readUsers, updateItem } from "@directus/sdk";
import { NextFunction } from "grammy";
import { setAdminCommands } from "../setcommands/setcommands.js";
import { decrypt } from "./decrypt.js";

export async function handleDeepLink(ctx: Context, next: NextFunction) {
  const payload = ctx.match;

  // if no match segments, then jump over this middleware step
  if (!payload || typeof payload !== "string" || !ctx.message) {
    await next();
    return;
  }

  // decrypt
  // format: prefix[1] + localSecret[?] + `.` + id[?]
  const plaintext = decrypt(payload);

  // get segments
  const [prefix, secretPlusId] = splitAt(plaintext, 1);
  const secretIdArray = secretPlusId.split(".");

  // check for invalid secretAndId — ensure all components exist
  if (secretIdArray?.length !== 2 || !prefix) {
    await ctx.reply("Invalid token");
    return;
  }

  // check for local secret — local check protects db against spam calls
  const [localSecret, id] = secretIdArray;
  if (localSecret !== config.LOCAL_SECRET) {
    await ctx.reply("Invalid token"); // Don't expose the issue
    return;
  }

  const senderTelegramId = ctx.message.from.id;

  /* ---------------------------- handle admin auth ------------------------- */
  if (prefix === "a") {
    const firstNameQuery = id;

    // Search for admin
    const adminMatches = await client.request(
      readUsers({
        filter: { first_name: { _eq: firstNameQuery } },
        fields: ["id", "first_name", "telegram_ids"],
      })
    );
    // FIXME: annotate for FORBIDDEN matches
    // .catch(() => {});

    // Break on no match
    if (adminMatches.length !== 1) {
      await ctx.reply(
        "No ID match found. Terminated action. Please contact developer."
      );
      return;
    }

    const adminMatch = adminMatches[0];

    // Check for existing admin
    if (adminMatch.telegram_ids?.includes(String(senderTelegramId))) {
      await ctx.reply(`${adminMatch.first_name}, you are already an admin!`);
      return;
    }

    // On success:
    await authenticateAdmin(adminMatch.id, senderTelegramId);
    await setAdminCommands(ctx, senderTelegramId);

    await ctx.reply(
      `Hello, ${firstNameQuery}. Successfully authenticated your Telegram account as an admin!`
    );
    return;
  }

  /* --------------------------- handle parent auth --------------------------*/
  if (prefix === "p") {
    // Search for admin
    const parent = await client.request(
      readItem("parent", id, { fields: ["name", "telegram_id"] })
    );
    // FIXME: annotate for FORBIDDEN matches
    // .catch(() => {});

    // Break on no match
    if (!parent) {
      await ctx.reply(
        "No ID match found. Terminated action. Please contact developer."
      );
      return;
    }

    // On success:
    await client.request(
      updateItem("parent", id, { telegram_id: senderTelegramId })
    );
    await ctx.reply(
      `Hello, ${parent.name}. Successfully linked your Telegram account to receive messages from the school!`
    );
    return;
  }

  await ctx.reply(`Invalid prefix: ${prefix}`);
}
