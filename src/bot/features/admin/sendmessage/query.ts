import Fuse from "fuse.js";
import { Student } from "~/lib/directus/schema.js";

// config
const THRESHOLD = 0.3;
const LIMIT = 3;

function getQueryResults(
  collection: Student[],
  query: string,
  ignoreList: Student[] = []
) {
  const ignoreStudents = new Set(ignoreList.map((r) => r.name));
  const filteredCollection = collection.filter(
    (student) => !ignoreStudents.has(student.name)
  );

  // instantiate fuse
  const fuse = new Fuse(filteredCollection, {
    threshold: THRESHOLD,
    keys: [{ name: "name", getFn: (pair) => pair.name }],
    ignoreLocation: true,
  });

  // search
  const results = fuse.search(query, { limit: LIMIT });

  // if one or no results, return
  if (results.length < 2) return results;

  // If many results...
  // test each for case-ignored substring occurrence
  const occurrence = results.filter((result) =>
    result.item.name.toLowerCase().includes(query.toLowerCase())
  );
  // if only one, return that one
  if (occurrence.length === 1) return occurrence;
  // else, return all results
  return results;
}

function getQueryResultsWrapper(
  collection: Student[],
  query: string,
  ignoreList: Student[] = []
) {
  return getQueryResults(collection, query, ignoreList).map((r) => r.item);
}

export { getQueryResultsWrapper as getQueryResults };
