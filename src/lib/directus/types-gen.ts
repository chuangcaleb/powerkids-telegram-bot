import { Identity } from "@directus/sdk";
import { directus } from "./index.js";

export type Student = Identity<
  Awaited<ReturnType<typeof directus.getRegistry>>[0]
>;
