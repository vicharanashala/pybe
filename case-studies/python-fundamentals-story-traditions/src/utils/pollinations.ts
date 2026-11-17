/** Local illustrations. The former exported names remain for component compatibility. */
export const stableSeed = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return Math.abs(hash);
};
export const pollinationsUrl = (prompt: string, width = 512, height = 512, seed?: number): string => {
  const hue = (seed ?? stableSeed(prompt)) % 360;
  const art = width > height
    ? `<circle cx="${width * .78}" cy="${height * .25}" r="${height * .13}" fill="hsl(${hue} 60% 80%)"/><path d="M0 ${height} L${width * .3} ${height * .3} L${width * .6} ${height}Z" fill="hsl(${hue} 25% 45%)"/><path d="M${width * .35} ${height} L${width * .75} ${height * .4} L${width} ${height}Z" fill="hsl(${(hue + 35) % 360} 30% 60%)"/>`
    : `<circle cx="${width / 2}" cy="${height * .38}" r="${width * .17}" fill="hsl(${hue} 35% 50%)"/><path d="M${width * .15} ${height} Q${width / 2} ${height * .12} ${width * .85} ${height}Z" fill="hsl(${hue} 35% 40%)"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title>Local story illustration</title><rect width="100%" height="100%" fill="hsl(${hue} 30% 90%)"/>${art}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
export const characterPortrait = (prompt: string, seed?: number): string => pollinationsUrl(prompt, 512, 512, seed);
export const sceneBackground = (prompt: string, seed?: number): string => pollinationsUrl(prompt, 1024, 576, seed);
