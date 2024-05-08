import { MessageXFragment } from "@grammyjs/hydrate/out/data/message.js";
import { Message } from "@grammyjs/types";
import { TargetMeta, Targets } from "../types.js";

function processOne(
  result: PromiseSettledResult<
    Message.CommonMessage & MessageXFragment & Message
  >,
  targetMeta: TargetMeta
) {
  const { children, parent } = targetMeta;
  const identifier = `${children.join(", ")} → <i>${parent}</i>`;
  if (result.status === "fulfilled") {
    return `✅ ${identifier}`;
  }
  return `❌ ${identifier}\n— <i>${String(result.reason)}</i>`;
}

export function processPromiseResults(
  allResults: PromiseSettledResult<
    Message.CommonMessage & MessageXFragment & Message
  >[],
  targets: Targets
) {
  const studentsArray = Object.values(targets);

  const logs = allResults
    .map((result, index) => processOne(result, studentsArray[index]))
    .join("\n");
  return `Message broadcasted:\n${logs}`;
}
