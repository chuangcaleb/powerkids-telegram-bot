import Fuse from "fuse.js";
import { REGISTRY_ARRAY } from "./mock-data.js";

const THRESHOLD = 0.4;
const LIMIT = 3;

const fuse = new Fuse(REGISTRY_ARRAY, {
  threshold: THRESHOLD,
  keys: [{ name: "name", getFn: (pair) => pair[0] }],
});

export function retrieveQueryResult(query: string) {
  return fuse.search(query, { limit: LIMIT });
}
