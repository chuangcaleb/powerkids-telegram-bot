import Fuse from "fuse.js";
import { REGISTRY_ARRAY, Student } from "./mock-data.js";

// config
const THRESHOLD = 0.3;
const LIMIT = 3;

function getQueryResults(query: string, ignoreList: Student[] = []) {
  const ignoredNames = new Set(ignoreList.map((r) => r[0]));
  const filteredRegistry = REGISTRY_ARRAY.filter(
    (value) => !ignoredNames.has(value[0])
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

function getQueryResultsWrapper(query: string, ignoreList: Student[] = []) {
  return getQueryResults(query, ignoreList).map((r) => r.item);
}

export { getQueryResultsWrapper as getQueryResults };
