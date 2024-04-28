import Fuse from "fuse.js";
import { REGISTRY_ARRAY } from "./mock-data.js";

const THRESHOLD = 0.3;
const LIMIT = 3;

const fuse = new Fuse(REGISTRY_ARRAY, {
  threshold: THRESHOLD,
  keys: [{ name: "name", getFn: (pair) => pair[0] }],
  ignoreLocation: true,
});

function getQueryResult(query: string) {
  const results = fuse.search(query, { limit: LIMIT });

  // if one or no results, return
  if (results.length < 2) return results;

  // If many results...
  // test each for case-ignored substring occurrence
  const occurrence = results.filter((result) =>
    result.item[0].toLowerCase().includes(query)
  );
  // if only one, return that one
  if (occurrence.length === 1) return occurrence;
  // else, return all results
  return results;
}

function getQueryResultWrapper(query: string) {
  return getQueryResult(query).map((result) => result.item);
}

export { getQueryResultWrapper as getQueryResults };
