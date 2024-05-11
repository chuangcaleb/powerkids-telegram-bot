export function stripAlphanumeric(string: string) {
  if (!string) return "";
  return string.replaceAll(/[^\da-z]/gi, "");
}
