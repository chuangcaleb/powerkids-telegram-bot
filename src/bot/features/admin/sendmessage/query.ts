import Fuse, { FuseResult } from "fuse.js";
import { REGISTRY_ARRAY, Student } from "./mock-data.js";

// config
const THRESHOLD = 0.3;
const LIMIT = 3;

export function getQueryResults(
  query: string,
  ignoreList: FuseResult<Student>[] = []
) {
  const ignoreIndexes = new Set(ignoreList.map((r) => r.refIndex));
  const filteredRegistry = REGISTRY_ARRAY.filter(
    (_, index) => !ignoreIndexes.has(index)
  );

  // instantiate fuse
  const fuse = new Fuse(filteredRegistry, {
    threshold: THRESHOLD,
    keys: [{ name: "name", getFn: (pair) => pair[0] }],
    ignoreLocation: true,
  });

  // search
  const results = fuse.search(query, { limit: LIMIT });

  // if one or no results, return
  if (results.length < 2) return results;

  // If many results...
  // test each for case-ignored substring occurrence
  const occurrence = results.filter((result) =>
    result.item[0].toLowerCase().includes(query.toLowerCase())
  );
  // if only one, return that one
  if (occurrence.length === 1) return occurrence;
  // else, return all results
  return results;
}
