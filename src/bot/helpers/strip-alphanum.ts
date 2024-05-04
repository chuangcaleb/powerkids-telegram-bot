export function stripAlphanumeric(string: string) {
  return string.replaceAll(/[^\da-z]/gi, "");
}
