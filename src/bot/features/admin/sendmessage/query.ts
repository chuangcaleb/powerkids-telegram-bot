import Fuse from "fuse.js";

// config
const THRESHOLD = 0.3;
const LIMIT = 3;

// Pre-configured query
function getQueryResults<T>(
  items: T[],
  query: string,
  getFunction: (item: T) => string
) {
  // instantiate fuse
  const fuse = new Fuse(items, {
    threshold: THRESHOLD,
    keys: [{ name: "name", getFn: getFunction }],
    ignoreLocation: true,
  });

  // search
  return fuse.search(query, { limit: LIMIT }).map((r) => r.item);
}

export { getQueryResults };
