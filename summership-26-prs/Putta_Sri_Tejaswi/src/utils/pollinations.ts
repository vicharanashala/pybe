/**
 * Pollinations.ai — free, no-API-key image generation.
 * Usage: pollinationsUrl("anime portrait of ...", 512, 512)
 * Returns a URL that, when fetched, triggers AI image generation.
 */
export const pollinationsUrl = (prompt: string, width = 512, height = 512, seed?: number): string => {
  const encoded = encodeURIComponent(prompt);
  const s = seed ?? Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${s}&nologo=true`;
};

/** Prebuilt character portrait URL (anime style, 512×512) */
export const characterPortrait = (prompt: string, seed?: number): string =>
  pollinationsUrl(`anime style character portrait, detailed illustration, ${prompt}, studio ghibli inspired, soft lighting, high quality`, 512, 512, seed);

/** Prebuilt scene background URL (illustration style, 1024×576 — 16:9) */
export const sceneBackground = (prompt: string, seed?: number): string =>
  pollinationsUrl(`detailed illustration, ${prompt}, studio ghibli inspired, cinematic lighting, high quality`, 1024, 576, seed);

/** Stable seed from a string — same name always gets same image */
export const stableSeed = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};
