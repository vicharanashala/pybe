export interface GenerateOptions {
  systemInstruction?: string;
  userPrompt: string;
  responseSchema?: unknown;
  maxTokens?: number;
  temperature?: number;
  selectedProvider?: string;
}
export const LOCAL_ONLY_MESSAGE = 'Automatic story generation has been removed. Use existing authored case studies or prepare and review a story manually.';
export async function generateLLMContent(_context: unknown, _options: GenerateOptions): Promise<string> {
  throw Object.assign(new Error(LOCAL_ONLY_MESSAGE), { code: 'LOCAL_ONLY', statusCode: 410 });
}
export function getGroqKeyCount(): number { return 0; }
