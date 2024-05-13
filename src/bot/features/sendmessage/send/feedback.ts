import { MessageId } from "@grammyjs/types";
import { TargetMeta } from "../types.js";

// type SendMessageSettledPromise = PromiseSettledResult<
//   Message.CommonMessage & MessageXFragment & Message
// >;
export interface MetaResult {
  result: PromiseSettledResult<MessageId>;
  targetMeta: TargetMeta;
}

function processOne(metaResult: MetaResult) {
  const { result, targetMeta } = metaResult;
  const { children, parent } = targetMeta;
  const identifier = `<b>${children.join(", ")}</b> → <i>${parent}</i>`;
  if (result.status === "fulfilled") {
    return `✅ ${identifier}`;
  }
  return `\n❌ ${identifier}\n  ↳ <i>${String(result.reason)}</i>`;
}

export function processPromiseResults(metaResults: MetaResult[]) {
  const logs = metaResults
    // sort (group) by status so 'fulfilled' is first, rejected later
    .sort((a, b) => {
      if (a.result.status === b.result.status) return 0;
      if (a.result.status === "rejected" && b.result.status === "fulfilled")
        return 1;
      return -1;
    })
    .map((metaResult) => processOne(metaResult))
    .join("\n");
  return `<b><u>Message broadcasted</u></b>\n\n${logs}`;
}
