import Fuse from "fuse.js";
import { REGISTRY_ARRAY } from "./mock-data.js";

const THRESHOLD = 0.3;
const LIMIT = 3;

const fuse = new Fuse(REGISTRY_ARRAY, {
  threshold: THRESHOLD,
  keys: [{ name: "name", getFn: (pair) => pair[0] }],
  includeScore: true,
  ignoreLocation: true,
});

export function retrieveQueryResult(query: string) {
  // TODO: hack to accept substring
  // if length < 2, return
  // test each for case-ignored substring occurence
  // if only one, return that one
  return fuse.search(query, { limit: LIMIT });
}
