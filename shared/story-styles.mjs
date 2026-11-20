// The shared shell owns fonts. Strip complete CSS imports, including semicolons inside a font URL.
export function authoredStyles(css) {
  return css
    .replace(/@import\s+(?:url\([^)]*\)|"[^"]*"|'[^']*')\s*[^;]*;/gi, "")
    .replaceAll(":root", ":host");
}
