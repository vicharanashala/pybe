import { GoogleGenAI } from '@google/genai';
import { RuntimeContext, Production, ComicPanelItem, ScenePromptItem, ProductionBlueprint } from '../types.js';
import { KnowledgeLoader } from './knowledgeLoader.js';
import { generateLLMContent } from './llmClient.js';
import { parseJsonResponse, extractArrayFromParsed } from './cklisOrchestrator.js';


/**
 * Helper to log progress
 */
function addLog(context: RuntimeContext, step: string, message: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') {
  context.logs.push({
    timestamp: new Date().toISOString(),
    step,
    message,
    level
  });
  console.log(`[CKLIS] [${step}] ${message}`);
}

/**
 * Build accumulated story context from the full educational analysis
 * This is the "Story Bible" passed to production engines
 */
function buildStoryBibleContext(context: RuntimeContext): string {
  const ea = context.educationalAnalysis;
  const scenario = ea.scenarios[0] as any;
  const userStory = context.learningRequest.userObservation || context.learningRequest.experienceHints || '';
  const storyGrounding = KnowledgeLoader.getCanonicalStoryGrounding(userStory || context.learningRequest.topic);

  return `
=== ACCUMULATED STORY BIBLE FROM CKLIS ANALYSIS ===
Topic: ${context.learningRequest.topic}
Programming Language: ${context.learningRequest.programmingLanguage || 'Python'}
Environment/Domain: ${context.learningRequest.experienceHints || 'Cultural Discovery'}
USER PROVIDED CUSTOM STORY / OBSERVATION: ${userStory || 'None (System dynamically selects authentic domain story)'}

${storyGrounding}

CRITICAL USER STORY PRESERVATION DIRECTIVE (CONSTITUTIONAL LAWS CL-14, CL-18):
${userStory ? `The user explicitly requested this custom story/fable: "${userStory}". You MUST 100% preserve THIS EXACT STORY and its real characters (e.g. King Vikramaditya, Betaal, Emperor Akbar, Birbal, etc.). DO NOT rewrite, simplify, or replace the user's story with a generic scenario!` : 'Use the authentic domain story specified in the Story DNA below.'}

--- STORY DNA (from Scenario Engine) ---
Story Source: ${scenario?.storySource || userStory || 'Authentic domain story'}
Atmospheric Setting: ${scenario?.context || 'A culturally rich environment'}
Characters: ${JSON.stringify(scenario?.characters || ea.scenarios.map(s => s.characters).flat(), null, 2)}
Real Episode/Problem: ${scenario?.problem || ea.scenarios[0]?.problem || ''}
Concept Mapping: ${scenario?.conceptMapping || ea.scenarios[0]?.conceptMapping || ''}
Emotional Journey: ${scenario?.emotionalJourney || 'Curiosity → Discovery → Understanding → Confidence'}
Character Bible Seed: ${scenario?.characterBibleSeed || 'Real characters from the domain with authentic personalities'}
Environment Bible Seed: ${scenario?.environmentBibleSeed || 'Authentic atmospheric setting with real architectural and contextual details'}

--- MENTAL MODEL ---
Model Name: ${ea.mentalModel?.modelName || context.learningRequest.topic}
Core Analogy: ${ea.mentalModel?.coreAnalogy || ''}
Description: ${ea.mentalModel?.description || ''}
Visualization Strategy: ${ea.mentalModel?.visualizationStrategy || ''}

--- MISCONCEPTIONS ADDRESSED ---
${ea.misconceptions.map(m => `• ${m.misconception}\n  Fix: ${m.correctionStrategy}`).join('\n')}

--- STRUCTURAL PATTERNS ---
${ea.patterns.map(p => `• [${p.patternId}] ${p.patternName}: ${p.rule}\n  Code Example: ${p.example}`).join('\n')}

--- LEARNING EPISODES ---
${ea.episodes.map(e => `Episode ${e.episodeNumber}: ${e.title} (${e.estimatedTime})\n  Objective: ${e.objective}`).join('\n')}

CRITICAL CODE-TO-STORY CONNECTION DIRECTIVE:
Every panel/scene prompt MUST include an explicit executable ${context.learningRequest.programmingLanguage || 'Python'} code snippet in "codeSnippet" and a 1-line concept invariant callout in "educationalGraphic" showing how the story action maps line-by-line to Python code.
`;
}

// ============================================================
// SHORT COMIC PIPELINE (1-Page Single-Pass Generator)
// ============================================================

/**
 * SHORT COMIC PIPELINE (1-Page Fast Single-Pass Generator)
 * Aligns with 1_Page_Comic_Example.md specification.
 * Generates a complete 1-page educational comic (4-5 panels max) in a single optimized pass.
 */
export async function processShortComicPipeline(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  addLog(context, 'STUDIO: SHORT COMIC', 'Executing 1-Page Short Comic Pipeline (4-5 Panels)...');

  const storyBible = buildStoryBibleContext(context);

  const userPrompt = `
PROMPT: Generate Complete 1-Page Educational Short Comic (4 to 5 Panels)

${storyBible}

=== 1-PAGE SHORT COMIC CRITICAL INSTRUCTIONS ===
You are a Senior Educational Comic Illustrator and Writer.
Generate a complete 1-Page Short Comic (4 to 5 panels total).
DO NOT split into multiple pages.

For each panel (4-5 panels total) generate:
1. panelNumber (integer, 1 to 5)
2. purpose ("Story Hook & Curiosity" / "Physical Observation" / "Pattern Discovery" / "Code Bridge & Implementation")
3. storyProgress (2 sentences describing what happens physically in the story)
4. learningPurpose (1 sentence educational objective of this panel)
5. narrationBox (narrator text shown at top of panel — 1-2 sentences of literary story prose)
6. speechBubble (character dialogue — natural, authentic to personality, max 2 lines)
7. characterEmotion (specific facial expression)
8. panelComposition (visual staging description)
9. imagePrompt (60-80 words self-contained prompt ending with "Classic Indian educational comic illustration, clean ink lines, flat vibrant colors, expressive faces, high detail, print-ready, 4K.")
10. negativePrompt ("low quality, bad anatomy, extra limbs, logo, watermark, distorted face")
11. educationalGraphic (for Panel 4/5: 1-line concept callout e.g. "💡 IF → action, ELSE → alternate action")
12. codeSnippet (for final panel: 3-5 line clean executable ${context.learningRequest.programmingLanguage || 'Python'} snippet)

Also generate:
- "title": Comic Title
- "storyOverview": Short continuous story narrative summary (2-3 paragraphs)
- "characterBible": Character descriptions for main characters
- "environmentBible": Setting descriptions

Return JSON:
{
  "title": "...",
  "storyOverview": "...",
  "characterBible": "...",
  "environmentBible": "...",
  "panels": [...]
}
`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: KnowledgeLoader.buildSystemPrompt('PRODUCTION'),
      userPrompt,
      maxTokens: 2500,
      temperature: 0.80,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<any>(rawText, null);
    const panels = extractArrayFromParsed<ComicPanelItem>(parsed, ['panels', 'panel_list', 'comic_panels']);

    if (!parsed || panels.length === 0) {
      throw new Error('Short Comic Engine returned empty panel list');
    }

    const title = parsed.title || `${context.learningRequest.topic}: A 1-Page Comic Journey`;
    const finalPanels = sanitizePanels(panels, context, title);
    const finalContent = renderComicMarkdown(context, {
      title,
      storyOverview: parsed.storyOverview || `A 1-page educational comic exploring ${context.learningRequest.topic}`
    }, finalPanels);

    addLog(context, 'STUDIO: SHORT COMIC', `Generated 1-Page Short Comic with ${finalPanels.length} panels.`, 'success');

    return {
      deliverableType: 'Short Comic (1-Page)',
      title,
      content: finalContent,
      blueprint: {
        type: 'short-comic',
        title,
        storyOverview: parsed.storyOverview || `1-Page Short Comic explaining ${context.learningRequest.topic}`,
        characterBible: parsed.characterBible || 'Main characters',
        environmentBible: parsed.environmentBible || 'Authentic setting',
        panels: finalPanels,
        markdownBlueprint: `### ${title}\n\n1-Page Short Comic Blueprint`
      }
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    addLog(context, 'STUDIO: SHORT COMIC', `Short Comic Engine warning: ${errMsg}. Generating rich fallback 1-page comic.`, 'warn');
    const fallbackPanels = createFallbackComicPanels(context, {
      title: `Comic: ${context.learningRequest.topic}`,
      storyOverview: `An authentic story explaining ${context.learningRequest.topic}`
    });
    const fallbackTitle = `Short Comic: ${context.learningRequest.topic}`;
    const fallbackContent = renderComicMarkdown(context, { title: fallbackTitle, storyOverview: `An authentic story explaining ${context.learningRequest.topic}` }, fallbackPanels);
    return {
      deliverableType: 'Short Comic (1-Page)',
      title: fallbackTitle,
      content: fallbackContent,
      blueprint: {
        type: 'short-comic',
        title: fallbackTitle,
        characterBible: 'Story characters',
        environmentBible: 'Authentic setting',
        panels: fallbackPanels,
        markdownBlueprint: `### ${fallbackTitle}\n\nFallback short comic blueprint`
      }
    };
  }
}

// ============================================================
// LONG COMIC PIPELINE (CP1 → CP2 Multi-Page)
// ============================================================

/**
 * LONG COMIC PIPELINE (CP1 → CP2)
 * CP1: Generates full Production Blueprint (Character Bible, Environment Bible, Prop Bible, etc.)
 * CP2: Generates panel-by-panel script with copy-paste ready AI Image Prompts
 */
export async function processComicPipeline(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  const isShortComic = (context.learningRequest.representation || '').toLowerCase().includes('1-page') ||
                       (context.learningRequest.representation || '').toLowerCase().includes('short');

  addLog(context, 'STUDIO: COMIC (CP1)', `Executing Pass 1: Generating Full Comic Production Blueprint (${isShortComic ? 'Short 1-Page' : 'Long Multi-Page'})...`);

  const storyBible = buildStoryBibleContext(context);
  const cp1PromptSpec = KnowledgeLoader.getRepresentationTemplate('CP1');
  const numPanels = isShortComic ? '4 to 5' : '6 to 8';

  // ===========================
  // CP1: PRODUCTION BLUEPRINT (Condensed for Groq 2,500 max_tokens)
  // ===========================
  const cp1UserPrompt = `
PROMPT CP1: Generate Comic Production Blueprint
Comic Format: ${isShortComic ? '1-Page Short Comic' : 'Multi-Page Long Comic'}

${storyBible}

=== CP1 OUTPUT FORMAT (CONDENSED) ===

You are a Senior Comic Art Director. Generate a concise but complete Comic Production Blueprint.

Generate these 5 sections:

1. STORY OVERVIEW: Write the complete story (3-4 paragraphs) teaching the concept naturally. Use real characters from the Story Bible.

2. PANEL BREAKDOWN (${numPanels} panels): For each panel:
   - panelNumber, panelTitle, purpose (Hook/Discovery/Observation/Pattern/Code Bridge/Reflection)
   - storyProgress (2 sentences), learningPurpose (1 sentence), emotion

3. CHARACTER BIBLE: For each character: name, age, appearance (skin, face, hair, eyes), clothing (garments, colors, textures, accessories), expressions (3-4 key expressions), personality (2 sentences), consistency rules.

4. ENVIRONMENT BIBLE: For each location: architecture, time/lighting, mood, background elements, consistency rules.

5. IMAGE PROMPT SUFFIX: Quality token string for all image prompts (e.g. "Classic Indian educational comic illustration, clean ink lines, flat vibrant colors, expressive faces, high detail, 4K.")

Return JSON:
{
  "title": "comic title",
  "storyOverview": "full story text",
  "panelBreakdown": [{"panelNumber":1,"panelTitle":"...","purpose":"...","storyProgress":"...","learningPurpose":"...","emotion":"..."}],
  "characterBible": "full character descriptions text",
  "environmentBible": "full environment descriptions text",
  "imagePromptSuffix": "quality token string"
}`;

  let blueprintData: any = {
    title: `${context.learningRequest.topic}: A PyBe Story Experience`,
    storyOverview: `A curious learner discovers how ${context.learningRequest.topic} operates.`,
    characterBible: `Main characters from the selected story domain`,
    environmentBible: `Authentic setting from the selected domain`,
    imagePromptSuffix: 'Classic Indian educational comic illustration, clean ink lines, flat vibrant colors, expressive faces, high detail, print-ready, 4K.'
  };

  try {
    const rawCp1 = await generateLLMContent(ai, {
      systemInstruction: `${KnowledgeLoader.buildSystemPrompt('PRODUCTION')}\n\n${cp1PromptSpec || ''}`,
      userPrompt: cp1UserPrompt,
      maxTokens: 2500,
      temperature: 0.78,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    blueprintData = { ...blueprintData, ...parseJsonResponse(rawCp1, blueprintData) };
    const panelCount = blueprintData.panelBreakdown?.length || 0;
    addLog(context, 'STUDIO: COMIC (CP1)', `Pass 1 Complete. Blueprint: "${blueprintData.title}". ${panelCount} panels planned.`, 'success');
  } catch (err) {
    addLog(context, 'STUDIO: COMIC (CP1)', `CP1 warning: ${(err as Error).message}. Continuing with available data.`, 'warn');
  }

  // Pacing delay to allow Groq TPM rate limit window to cool down between Pass 1 and Pass 2
  await new Promise(resolve => setTimeout(resolve, 4000));

  // ===========================
  // CP2: PANEL-BY-PANEL SCRIPT WITH 300+ WORD IMAGE PROMPTS
  // ===========================
  addLog(context, 'STUDIO: COMIC (CP2)', 'Executing Pass 2: Generating Copy-Paste Ready Panel Scripts with Full AI Image Prompts (CP2)...');

  const cp2PromptSpec = KnowledgeLoader.getRepresentationTemplate('CP2');

  const cp2UserPrompt = `
PROMPT CP2: Generate Complete Comic Panel Scripts with Copy-Paste AI Image Prompts

Blueprint Title: ${blueprintData.title}
Story Overview: ${blueprintData.storyOverview}
Character Bible: ${blueprintData.characterBible}
Environment Bible: ${blueprintData.environmentBible}
Visual Style Guide: ${blueprintData.visualStyleGuide || ''}
Global Rules: ${blueprintData.globalRules || ''}
Image Prompt Quality Suffix: "${blueprintData.imagePromptSuffix || 'Classic Indian educational comic illustration, clean ink lines, flat vibrant colors, expressive faces, high detail, print-ready, 4K.'}"
Panel Breakdown: ${JSON.stringify(blueprintData.panelBreakdown || [], null, 2)}

Programming Language: ${context.learningRequest.programmingLanguage || 'Python'}

=== CP2 CRITICAL INSTRUCTIONS ===

IMPORTANT: Generate ${numPanels} complete panels. Each panel MUST have a self-contained Reference Image Prompt (60-80 words).

NEVER say "same character", "same location", "as before" in image prompts.
EVERY image prompt must be INDEPENDENTLY generatable with:
✓ Character physical description, expression, pose
✓ Environment description, lighting, atmosphere
✓ Ending with the quality suffix tokens

For each panel provide ALL of these fields:
1. panelNumber (integer)
2. purpose (e.g. "Misconception Hook", "Pattern Discovery", "Code Bridge")
3. storyProgress (what happens narratively in this panel — 2-3 sentences)
4. learningPurpose (educational goal of this panel — 1 sentence)
5. narrationBox (narrator text shown in the panel — 1-2 sentences)
6. speechBubble (character dialogue — natural, personality-authentic, maximum 2 lines)
7. characterEmotion (specific emotion name)
8. panelComposition (visual staging description)
9. imagePrompt (60-80 words self-contained prompt ending with quality suffix)
10. negativePrompt ("low quality, bad anatomy, extra limbs, logo, watermark, distorted face")
11. educationalGraphic (optional callout: e.g. "❓ Check First", "💡 Pattern: IF → action")
12. codeSnippet (for the final 1-2 panels: exact Python/language code snippet)

Return JSON with:
- "title": comic title
- "panels": array of panel objects with ALL fields above
`;

  try {
    const rawCp2 = await generateLLMContent(ai, {
      systemInstruction: `${KnowledgeLoader.buildSystemPrompt('PRODUCTION')}\n\n${cp2PromptSpec || ''}`,
      userPrompt: cp2UserPrompt,
      maxTokens: 2500,
      temperature: 0.82,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<any>(rawCp2, null);
    const finalPanels = extractArrayFromParsed<ComicPanelItem>(parsed, ['panels', 'panel_list', 'comic_panels', 'scenes', 'scene_list', 'items']);

    if (finalPanels.length === 0) {
      throw new Error('Comic Production Engine returned empty panel list');
    }
    const finalContent = parsed.content && parsed.content.length > 300 ? parsed.content : renderComicMarkdown(context, blueprintData, finalPanels);

    const blueprint: ProductionBlueprint = {
      type: isShortComic ? 'short-comic' : 'long-comic',
      title: parsed.title || blueprintData.title,
      characterBible: blueprintData.characterBible,
      environmentBible: blueprintData.environmentBible,
      panels: finalPanels,
      markdownBlueprint: `### ${blueprintData.title}\n\n${blueprintData.storyOverview}`
    };

    addLog(context, 'STUDIO: COMIC (CP2)', `Pass 2 Complete. Generated ${finalPanels.length} panels.`, 'success');

    return {
      deliverableType: isShortComic ? 'Short Comic (1-Page)' : 'Long Comic (Multi-Page)',
      title: parsed.title || blueprintData.title,
      content: finalContent,
      blueprint
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    addLog(context, 'STUDIO: COMIC (CP2)', `Comic Engine warning: ${errMsg}. Generating rich fallback comic script.`, 'warn');
    const fallbackPanels = createFallbackComicPanels(context, blueprintData);
    const fallbackTitle = blueprintData.title || `Comic: ${context.learningRequest.topic}`;
    const fallbackContent = renderComicMarkdown(context, blueprintData, fallbackPanels);
    return {
      deliverableType: isShortComic ? 'Short Comic (1-Page)' : 'Long Comic (Multi-Page)',
      title: fallbackTitle,
      content: fallbackContent,
      blueprint: {
        type: isShortComic ? 'short-comic' : 'long-comic',
        title: fallbackTitle,
        characterBible: blueprintData.characterBible,
        environmentBible: blueprintData.environmentBible,
        panels: fallbackPanels,
        markdownBlueprint: `### ${fallbackTitle}\n\nFallback comic blueprint`
      }
    };
  }
}

// ============================================================
// VIDEO PIPELINE (VP1 → VP2)
// ============================================================

/**
 * VIDEO PIPELINE (VP1 → VP2)
 * VP1: Full 8-section Production Blueprint (Character Bible, Environment Bible, Prop Bible, Visual Style, etc.)
 * VP2: Scene-by-scene with 13 sub-sections each — matching Video_Example.md benchmark exactly
 */
export async function processVideoPipeline(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  addLog(context, 'STUDIO: VIDEO (VP1)', 'Executing Pass 1: Generating Full Video Production Blueprint (VP1)...');

  const storyBible = buildStoryBibleContext(context);
  const vp1PromptSpec = KnowledgeLoader.getRepresentationTemplate('VP1');

  // ===========================
  // VP1: FULL 8-SECTION BLUEPRINT
  // ===========================
  const vp1UserPrompt = `
PROMPT VP1: Generate Full Video Production Blueprint

${storyBible}

=== VP1 MANDATORY OUTPUT FORMAT ===

You are a Senior Educational Film Director, Learning Experience Designer, and AI Production Planner.
Your task: Generate a COMPLETE Video Production Blueprint that preserves every educational decision and makes the content ready for scene-by-scene AI video generation.

CRITICAL: DO NOT MODIFY THE STORY BIBLE. Only expand it into production detail.
DO NOT generate video prompts or image prompts in VP1. That is VP2's job.

Generate ALL 8 sections:

SECTION 1 — LEARNING SUMMARY
- Learning Goal
- Learning Objective
- Core Concept (one-line definition a child understands)
- Target Audience
- Story Theme
- Emotional Journey (e.g. "Curiosity → Mystery → Discovery → Understanding → Confidence")
- Teaching Strategy

SECTION 2 — STORY OVERVIEW
Write the COMPLETE continuous story narrative (minimum 4-5 paragraphs).
This is the story a viewer watches. It must teach the concept through observation — learner discovers before being told.
Use real characters and real episode from the Story Bible.

SECTION 3 — SCENE BREAKDOWN
Divide the story into AI-video-friendly scenes. Each scene lasts 6-10 seconds.
AI decides how many scenes are needed — minimum 6, maximum 12.
For each scene provide:
- sceneNumber
- sceneTitle
- scenePurpose (Intro / Build Curiosity / First Observation / Alternate Outcome / Pattern Discovery / Mental Model / Concept Reveal / Everyday Transfer / Reflection & Summary)
- storyProgress (what happens)
- learningPurpose (what the learner gains)
- emotion (learner's emotional state)
- beginningState
- endingState
- duration ("8 seconds")

SECTION 4 — CHARACTER BIBLE
For EVERY character:
- Name and role
- Age and gender
- Appearance (skin, face shape, distinctive features)
- Hair (style, color, length)
- Eyes (shape, color)
- Clothing (every garment, exact colors, textures, accessories)
- Footwear (exact description)
- Accessories
- Expressions (5 key expressions used in story)
- Body Language
- Personality (3-4 sentences)
- Speaking Style
- Consistency Rules (what never changes across all scenes)

SECTION 5 — ENVIRONMENT BIBLE
For every location:
- Architecture (material, style, period, specific notable features)
- Time of Day
- Weather
- Lighting (source, angle, color temperature)
- Mood
- Background Elements
- Ground Texture
- Sky Description
- Key Visual Details
- Consistency Rules

SECTION 6 — PROP BIBLE
Every recurring object: Appearance, Material, Color, Size, Purpose in story, Consistency Rules

SECTION 7 — VISUAL STYLE GUIDE
- Animation Style
- Rendering Style
- Color Palette (specific colors with names/hex)
- Lighting Style
- Camera Style
- Composition Style
- Mood
- Educational Graphics Style (flat vector overlays, font style)
- Subtitle Style
- Music Style
- Sound Design Style
- Image prompt quality suffix tokens

SECTION 8 — GLOBAL PRODUCTION RULES
All rules for character consistency, lighting, environment, costume, camera, animation, and SnapGenAI optimization.

Return JSON with:
"title", "storyOverview", "sceneBreakdown" (array), "characterBible" (full text), "characterBibleStructured" (array),
"environmentBible" (full text), "propBible", "visualStyleGuide", "globalRules",
"imagePromptSuffix" (exact quality token string for all image prompts),
"snapVideoNegativePrompt" (global negative prompt for all SnapGenAI calls)
`;

  let blueprintData: any = {
    title: `${context.learningRequest.topic}: A PyBe Educational Video`,
    storyOverview: `An authentic story reveals how ${context.learningRequest.topic} works through observation.`,
    characterBible: 'Characters from the authentic domain story',
    environmentBible: 'Authentic atmospheric setting',
    imagePromptSuffix: 'Pixar-quality 3D animation, ultra detailed, cinematic composition, global illumination, volumetric lighting, expressive faces, child-friendly, vibrant Indian colors, professional lighting, 8K.',
    snapVideoNegativePrompt: 'camera shake, face morphing, costume changing, teleportation, extra people, distorted movement, warping, flickering, frame glitches, text, logo, watermark, low quality'
  };

  try {
    const rawVp1 = await generateLLMContent(ai, {
      systemInstruction: `${KnowledgeLoader.buildSystemPrompt('PRODUCTION')}\n\n${vp1PromptSpec || ''}`,
      userPrompt: vp1UserPrompt,
      maxTokens: 2500,
      temperature: 0.78,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    blueprintData = { ...blueprintData, ...parseJsonResponse(rawVp1, blueprintData) };
    const sceneCount = blueprintData.sceneBreakdown?.length || 0;
    addLog(context, 'STUDIO: VIDEO (VP1)', `Pass 1 Complete. Blueprint: "${blueprintData.title}". Scene breakdown: ${sceneCount} scenes planned.`, 'success');
  } catch (err) {
    addLog(context, 'STUDIO: VIDEO (VP1)', `VP1 warning: ${(err as Error).message}. Continuing with available data.`, 'warn');
  }

  // Pacing delay to allow Groq TPM rate limit window to cool down between Pass 1 and Pass 2
  await new Promise(resolve => setTimeout(resolve, 4000));

  // ===========================
  // VP2: SCENE-BY-SCENE WITH 13 SUB-SECTIONS
  // ===========================
  addLog(context, 'STUDIO: VIDEO (VP2)', 'Executing Pass 2: Generating Scene-by-Scene Production Prompts with Copy-Paste AI Prompts (VP2)...');

  const vp2PromptSpec = KnowledgeLoader.getRepresentationTemplate('VP2');

  const vp2UserPrompt = `
PROMPT VP2: Generate Complete Video Scene-by-Scene Production Package

Blueprint Title: ${blueprintData.title}
Story Overview: ${blueprintData.storyOverview}
Scene Breakdown Planned: ${JSON.stringify(blueprintData.sceneBreakdown || [], null, 2)}
Character Bible: ${blueprintData.characterBible}
Environment Bible: ${blueprintData.environmentBible}

=== VP2 CRITICAL INSTRUCTIONS ===

Generate all scenes completely. Every Reference Image Prompt must be self-contained (60-80 words).

For each scene generate:
1. sceneNumber (integer)
2. title (scene title)
3. duration ("8 seconds")
4. summary (2-3 sentence description)
5. refImagePrompt (60-80 words self-contained image prompt ending with quality suffix: "${blueprintData.imagePromptSuffix}")
6. refImageNegativePrompt ("low quality, bad anatomy, distorted face, logo, watermark")
7. snapVideoPrompt (UNDER 60 WORDS — motion description: character action, camera move, emotion)
8. snapNegativePrompt ("${blueprintData.snapVideoNegativePrompt}")
9. cameraDirection (shot type, angle, movement)
10. narration (voiceover text, max 2 sentences)
11. dialogue (character dialogue, max 2 lines)
12. soundEffects (environmental audio)
13. backgroundMusic (music cue)
14. educationalGraphics (on-screen caption, e.g. "💡 IF → action")
15. transitionSuggestion (visual transition sentence)

Return JSON:
{
  "title": "video title",
  "scenes": [scene objects with fields 1-15 above]
}
`;

  try {
    const rawVp2 = await generateLLMContent(ai, {
      systemInstruction: `${KnowledgeLoader.buildSystemPrompt('PRODUCTION')}\n\n${vp2PromptSpec || ''}`,
      userPrompt: vp2UserPrompt,
      maxTokens: 2500,
      temperature: 0.82,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<any>(rawVp2, null);
    const finalScenes = extractArrayFromParsed<ScenePromptItem>(parsed, ['scenes', 'scene_list', 'video_scenes', 'panels', 'items']);

    if (finalScenes.length === 0) {
      throw new Error('Video Production Engine returned empty scene list');
    }
    const finalContent = parsed.content && parsed.content.length > 300 ? parsed.content : renderVideoMarkdown(context, blueprintData, finalScenes);

    const mappedPanels: ComicPanelItem[] = finalScenes.map((s, idx) => ({
      panelNumber: s.sceneNumber || idx + 1,
      purpose: s.title || `Scene ${idx + 1}`,
      storyProgress: s.summary,
      learningPurpose: s.narration,
      narrationBox: s.narration,
      speechBubble: s.dialogue || '',
      characterEmotion: 'Cinematic',
      panelComposition: s.cameraDirection || 'Medium wide shot',
      imagePrompt: s.refImagePrompt,
      negativePrompt: s.refImageNegativePrompt || 'low quality, bad anatomy'
    }));

    addLog(context, 'STUDIO: VIDEO (VP2)', `Pass 2 Complete. ${finalScenes.length} scenes.`, 'success');

    return {
      deliverableType: 'Video Script',
      title: parsed.title || blueprintData.title,
      content: finalContent,
      blueprint: {
        type: 'video',
        title: parsed.title || blueprintData.title,
        characterBible: blueprintData.characterBible,
        environmentBible: blueprintData.environmentBible,
        scenes: finalScenes,
        panels: mappedPanels,
        markdownBlueprint: `### ${blueprintData.title}\n\n${blueprintData.storyOverview}`
      }
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    addLog(context, 'STUDIO: VIDEO (VP2)', `Video Engine warning: ${errMsg}. Generating rich fallback video script.`, 'warn');
    const fallbackPanels = createFallbackComicPanels(context, blueprintData);
    const fallbackTitle = blueprintData.title || `Video Script: ${context.learningRequest.topic}`;
    const fallbackContent = renderVideoMarkdown(context, blueprintData, fallbackPanels.map((p, idx) => ({
      sceneNumber: idx + 1,
      title: p.purpose,
      duration: '8 seconds',
      summary: p.storyProgress,
      refImagePrompt: p.imagePrompt,
      refImageNegativePrompt: p.negativePrompt,
      snapVideoPrompt: `Camera moves slowly as ${p.purpose}`,
      snapNegativePrompt: 'low quality, text, logo',
      cameraDirection: p.panelComposition,
      narration: p.narrationBox,
      dialogue: p.speechBubble,
      soundEffects: 'Ambient background audio',
      backgroundMusic: 'Cinematic educational music',
      transitionSuggestion: 'Smooth cross dissolve to next scene'
    })));
    return {
      deliverableType: 'Video Script',
      title: fallbackTitle,
      content: fallbackContent,
      blueprint: {
        type: 'video',
        title: fallbackTitle,
        characterBible: blueprintData.characterBible,
        environmentBible: blueprintData.environmentBible,
        panels: fallbackPanels,
        markdownBlueprint: `### ${fallbackTitle}\n\nFallback video script`
      }
    };
  }
}

// ============================================================
// PODCAST PIPELINE
// ============================================================

export async function processPodcastPipeline(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  addLog(context, 'STUDIO: PODCAST', 'Generating Audio Podcast script with complete sound design cues...');

  const storyBible = buildStoryBibleContext(context);

  const userPrompt = `
PROMPT POD-01: Generate Complete Audio Podcast Script

${storyBible}

=== PODCAST SCRIPT REQUIREMENTS ===

You are a Senior Educational Audio Producer.
Generate a complete, broadcast-quality audio podcast script with TWO hosts:
- Alex: Inquisitive host who asks the questions a learner would ask. Friendly, curious, occasionally gets things wrong to create natural misconception moments.
- Dr. Sam: Expert educator who explains concepts through real-world analogies and stories. Never uses jargon without explaining it. Warm, patient, storytelling voice.

The podcast must follow this exact arc:
1. [INTRO MUSIC FADE IN] — Theme music
2. Alex introduces the topic with a hook question (never state the concept directly)
3. Dr. Sam begins with the REAL STORY from the story bible — tells it as a captivating narrative
4. [SFX: Appropriate ambient sound for the story setting]
5. Alex asks "Wait, but what does that have to do with programming?"
6. Dr. Sam bridges story → concept naturally
7. [SFX: Light bulb moment sound — gentle chime]
8. Alex voices the common misconception — Dr. Sam addresses it through the story
9. Pattern revelation through storytelling, NOT direct explanation
10. Code walkthrough segment — Dr. Sam reveals the code slowly, line by line
11. Practice moment — Alex poses a scenario, listeners think before answer is revealed
12. Reflection — Both hosts summarize 3 key takeaways
13. [OUTRO MUSIC FADE IN]

Include ALL of:
- [SFX: description] for every sound effect
- [MUSIC: description] for every music cue
- [PAUSE: X seconds] for listener reflection moments
- Complete dialogue for both hosts
- Emphasis markers like *word* for stressed words

Generate "content" as the complete beautifully formatted podcast script.
Generate "title" as the podcast episode title.

Return JSON: {"title": "...", "content": "..."}
`;

  try {
    const rawPod = await generateLLMContent(ai, {
      systemInstruction: KnowledgeLoader.buildSystemPrompt('PRODUCTION'),
      userPrompt,
      maxTokens: 16384,
      temperature: 0.85,
      selectedProvider: context.learningRequest.selectedProvider
    });

    const parsed = parseJsonResponse<{ title: string; content: string }>(
      rawPod,
      null as any
    );

    if (!parsed || !parsed.content) {
      throw new Error('Podcast Production Engine returned empty content');
    }

    addLog(context, 'STUDIO: PODCAST', `Podcast script generated: "${parsed.title}" (${parsed.content.length} chars).`, 'success');

    return {
      deliverableType: 'Podcast',
      title: parsed.title,
      content: parsed.content,
      blueprint: {
        type: 'podcast',
        title: parsed.title,
        characterBible: 'Podcast Hosts: Alex (Inquisitive Co-Host) & Dr. Sam (Educational Host)',
        environmentBible: 'Audio Recording Studio with Sound Stage Acoustics',
        markdownBlueprint: `# ${parsed.title}\n\nAudio Podcast Script`
      }
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    addLog(context, 'STUDIO: PODCAST', `Podcast Engine warning: ${errMsg}. Generating rich fallback podcast script.`, 'warn');
    const fallbackTitle = `Podcast: Understanding ${context.learningRequest.topic}`;
    const fallbackContent = `# ${fallbackTitle}\n\n[INTRO MUSIC FADE IN]\n\n**Alex**: Welcome back! Today we're exploring ${context.learningRequest.topic}.\n\n**Dr. Sam**: That's right, Alex. Let's look at how this mechanism operates through an authentic story...\n\n[OUTRO MUSIC FADE IN]`;
    return {
      deliverableType: 'Podcast',
      title: fallbackTitle,
      content: fallbackContent,
      blueprint: {
        type: 'podcast',
        title: fallbackTitle,
        characterBible: 'Podcast Hosts: Alex & Dr. Sam',
        environmentBible: 'Audio Recording Studio',
        markdownBlueprint: `# ${fallbackTitle}\n\nAudio Podcast Script`
      }
    };
  }
}

// ============================================================
// STORYBOOK PIPELINE (Split-Screen Narrative)
// ============================================================

export async function processStorybookPipeline(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  addLog(context, 'STUDIO: STORYBOOK', 'Generating Storybook split-screen scenes...');

  const storyBible = buildStoryBibleContext(context);

  const userPrompt = `
PROMPT STB-01: Generate Storybook Split-Screen Scenes

${storyBible}

=== STORYBOOK FORMAT & EXPANSIVE STORY-FIRST ALIGNMENT ===

You are a Children's Book Illustrator, Educational Story Designer, and Computer Science Educator.
Generate a Storybook with split-screen layout:
- LEFT SIDE: Illustration (AI-generated image prompt)
- RIGHT SIDE: Story text (narration box + dialogue)

Generate 6 to 8 rich, expansive chapters so the story has plenty of room to develop, immerse the reader, and tell a complete, captivating narrative.

CRITICAL REAL-WORLD STORY AUTHENTICITY DIRECTIVE (CONSTITUTIONAL LAWS CL-17, CL-18, CL-19, CL-20):
- CL-17 (AUTHENTIC REAL-WORLD STORY): Tell the story 100% authentically as a real literary narrative, historical event, or natural fable. DO NOT rewrite the story or insert software variable names into the story narrative or dialogue!
- CL-19 (SELF-CONTAINED GROUNDING): Tell the story completely from scratch with clear character introductions, setting establishment, physical motivations, step-by-step physical actions, and natural resolution. NEVER truncate, distort, or assume the reader already knows the fable! Anyone with ZERO prior knowledge of the story must understand 100% of what happens!
- CL-20 (PROGRESSIVE 2-STEP MICRO-CODE BREAKDOWN):
  1) EARLY CHAPTERS (Chapters 1 to N-2): Pure literary storytelling telling the complete real-world event naturally. No code words, no technical clutter!
  2) PENULTIMATE CHAPTER (Chapter N-1 — STEP 1 MICRO CODE PRIMITIVE): Explain how this exact story pattern is used in real-world Computer Science applications. Include an ultra-simple 3-line micro-code primitive snippet (codeSnippet: 3 lines max focusing ONLY on the core mechanism).
  3) FINAL CHAPTER (Chapter N — STEP 2 COMPLETE MICRO SCRIPT): Reaches complete resolution and smoothly aligns with executable ${context.learningRequest.programmingLanguage || 'Python'} syntax! Include an ultra-clean 4-5 line executable micro-script (codeSnippet: 4-5 lines max with clear inline story comments linking physical actions to code lines). NEVER dump large or complex function blocks on the learner!

For each chapter provide these fields:
1. panelNumber (integer)
2. purpose ("Setting the Scene" / "Curiosity & Conflict" / "First Observation" / "Pattern Discovery" / "Mental Model" / "Concept Bridge" / "Smooth Code Alignment")
3. storyProgress (what happens in this scene — 2-3 sentences)
4. learningPurpose (what the learner gains — 1 sentence)
5. narrationBox (Story text for RIGHT side — 4-6 sentences of rich literary narrative prose)
6. speechBubble (Character dialogue — authentic to personality, 1-2 lines)
7. characterEmotion (specific expression)
8. panelComposition (visual staging description)
CRITICAL VISUAL COMPREHENSION DIRECTIVE (FOR LAZY READERS WHO ONLY LOOK AT THE GENERATED IMAGE):
- EVERY imagePrompt MUST BE COMPLETELY SELF-CONTAINED (MINIMUM 200 WORDS).
- A person looking ONLY at the AI-generated image (without reading the right-side text) MUST BE ABLE TO UNDERSTAND 100% OF WHAT IS HAPPENING IN THE SCENE!
- Every imagePrompt MUST include:
  1) Character physical description, age, clothing, exact body posture, facial emotion, and key physical action.
  2) Full environment architecture, time of day, lighting direction, color palette, and atmospheric mood.
  3) Embedded Speech/Thought Balloon & Visual Action: Explicitly describe how the character's speech/thought balloon or key action cue is visually rendered inside the illustration (e.g. "In the upper-right area of the scene, a stylized hand-drawn speech balloon reads: '...'").
  4) End with: "Storybook illustration style, warm watercolor palette, soft detailed linework, warm golden tones, child-friendly, high detail, print-ready, 4K."

For each chapter provide these fields:
1. panelNumber (integer)
2. purpose ("Setting the Scene" / "Curiosity & Conflict" / "First Observation" / "Pattern Discovery" / "Mental Model" / "Concept Bridge" / "Smooth Code Alignment")
3. storyProgress (what happens in this scene — 2-3 sentences)
4. learningPurpose (what the learner gains — 1 sentence)
5. narrationBox (Story text for RIGHT side — 4-6 sentences of rich literary narrative prose)
6. speechBubble (Character dialogue — authentic to personality, 1-2 lines)
7. characterEmotion (specific expression)
8. panelComposition (visual staging description)
9. imagePrompt (MINIMUM 200 WORDS — complete self-contained illustration prompt with embedded speech balloon context as described above)
10. negativePrompt ("low quality, dark, blurry, text errors, watermark, distorted face, extra limbs")
11. educationalGraphic (ONLY for Chapter N-1 & N — 1-line concept callout; empty string "" for earlier chapters)
12. codeSnippet (ONLY for Final Chapter N — clean 4-8 line executable Python snippet; empty string "" for all earlier chapters)

Also generate:
- "storyOverview": Full continuous story narrative (minimum 3-4 detailed paragraphs).
- "characterBible": Complete character design specifications describing physical appearance, clothing, age, personality, and expressions for all characters.
- "environmentBible": Complete environment design specifications describing architecture, time of day, lighting, weather, ground textures, and atmospheric mood.
- "visualStyleGuide": Visual style rules, illustration style, color palette, line art style, and image prompt quality tokens.
- "title": Storybook title.

Return JSON: {"title": "...", "storyOverview": "...", "characterBible": "...", "environmentBible": "...", "visualStyleGuide": "...", "panels": [...]}
`;

  try {
    const rawStb = await generateLLMContent(ai, {
      systemInstruction: KnowledgeLoader.buildSystemPrompt('PRODUCTION'),
      userPrompt,
      maxTokens: 2500,
      temperature: 0.85,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<{ title: string; storyOverview: string; characterBible: string; environmentBible: string; visualStyleGuide: string; panels: ComicPanelItem[] }>(
      rawStb,
      null as any
    );

    if (!parsed || !parsed.panels || parsed.panels.length === 0) {
      throw new Error('Storybook Production Engine returned empty panel list');
    }

    const title = parsed.title || `${context.learningRequest.topic}: A Storybook Experience`;
    const finalPanels = sanitizePanels(parsed.panels, context, title);
    const finalContent = renderStorybookMarkdown(context, title, finalPanels);

    addLog(context, 'STUDIO: STORYBOOK', `Generated ${finalPanels.length} complete storybook scenes with rich Blueprint.`, 'success');

    return {
      deliverableType: 'Storybook',
      title,
      content: finalContent,
      blueprint: {
        type: 'storybook',
        title,
        storyOverview: parsed.storyOverview || `A rich authentic story exploring ${context.learningRequest.topic}`,
        characterBible: parsed.characterBible || `Characters from ${context.learningRequest.topic}`,
        environmentBible: parsed.environmentBible || context.learningRequest.experienceHints || 'Warm storybook world',
        panels: finalPanels,
        markdownBlueprint: `### ${title}\n\n#### Story Overview\n${parsed.storyOverview || ''}\n\n#### Character Bible\n${parsed.characterBible || ''}\n\n#### Environment Bible\n${parsed.environmentBible || ''}\n\n#### Visual Style Guide\n${parsed.visualStyleGuide || ''}`
      }
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    addLog(context, 'STUDIO: STORYBOOK', `Storybook Engine warning: ${errMsg}. Generating rich fallback storybook.`, 'warn');
    const fallbackPanels = createFallbackComicPanels(context, {
      title: `The Story of ${context.learningRequest.topic}`,
      storyOverview: `An authentic story explaining ${context.learningRequest.topic}`
    });
    const fallbackTitle = `${context.learningRequest.topic}: A Storybook Journey`;
    const fallbackContent = renderStorybookMarkdown(context, fallbackTitle, fallbackPanels);
    return {
      deliverableType: 'Storybook',
      title: fallbackTitle,
      content: fallbackContent,
      blueprint: {
        type: 'storybook',
        title: fallbackTitle,
        storyOverview: context.educationalAnalysis.scenarios[0]?.context || `An authentic story exploring ${context.learningRequest.topic}`,
        characterBible: 'Story characters',
        environmentBible: context.learningRequest.experienceHints || 'Warm storybook world',
        panels: fallbackPanels,
        markdownBlueprint: `### ${fallbackTitle}\n\nFallback storybook blueprint`
      }
    };
  }
}

/**
 * Helper to generate authentic, topic-specific Python code snippets
 * directly mapping real story variables (No generic perform_story_action placeholders!)
 */
function generateRealTopicCodeSnippet(topic: string, storySource: string, lang: string = 'Python'): string {
  const t = (topic || '').toLowerCase();
  const s = (storySource || '').toLowerCase();

  if (s.includes('crow') || s.includes('pitcher') || s.includes('pebble') || t.includes('accumulator') || t.includes('state transition')) {
    return `# ${lang} Code Implementation: The Thirsty Crow's Accumulator Loop
water_level = 0.2        # Initial water height at bottom of pitcher (units)
TARGET_HEIGHT = 1.0      # Reachable height for crow's beak
pebbles_dropped = 0      # Physical state counter

# Loop Invariant: Repeat physical action until water level reaches target height
while water_level < TARGET_HEIGHT:
    pebbles_dropped += 1
    water_level += 0.2   # Each dropped pebble displaces 0.2 units of water

print(f"Success! Water reached {water_level:.1f} units after dropping {pebbles_dropped} pebbles.")`;
  }

  if (s.includes('vikram') || s.includes('betal') || s.includes('pachisi')) {
    return `# ${lang} Code Implementation: King Vikram & Betaal State Machine Loop
betaal_captured = True
king_vow_silence = True

# Loop Invariant: Betaal remains captured as long as King Vikram stays silent
while betaal_captured:
    betaal_riddle = "What was the righteous decision of the King?"
    answer = vikram_answer_riddle(betaal_riddle)  # King Vikram knows the truth
    
    if answer is not None:  # Righteous Vikram speaks the truth
        king_vow_silence = False
        betaal_captured = False
        print("Silence broken! Betaal laughs 'Ha ha ha!' and flies back to banyan tree.")
        break  # State transition: Must return to cremation ground to recapture Betaal`;
  }

  if (s.includes('akbar') || s.includes('birbal') || t.includes('if') || t.includes('else') || t.includes('condition')) {
    return `# ${lang} Code Implementation: Emperor Akbar's Decree & Birbal's Decision Gate
def verify_court_claim(claim_evidence):
    # Condition Predicate: Evaluate real-world physical invariant
    if claim_evidence == "PROVEN_PHYSICAL_FACT":
        return "Birbal Proves Claim (True Branch Executed)"
    else:
        return "Court Claim Rejected (False Branch Executed)"

# Execution
result = verify_court_claim(birbal_evidence)
print(f"Imperial Judgment: {result}")`;
  }

  if (t.includes('join') || t.includes('sql') || s.includes('detective')) {
    return `-- SQL Code Implementation: Prescriptive Primary Retention (LEFT JOIN)
SELECT 
    d.detective_name,
    d.case_id,
    c.clue_description
FROM detectives d
LEFT JOIN clues c ON d.case_id = c.case_id;`;
  }

  if (t.includes('recursion') || t.includes('stack')) {
    return `# ${lang} Code Implementation: Recursive Call Stack Unwinding
def solve_recursive_step(remaining_depth):
    # Base Case: Termination Gate
    if remaining_depth <= 0:
        return "Base Case Reached (Unwinding Stack)"
    
    # Recursive Progression
    return f"Step {remaining_depth} -> " + solve_recursive_step(remaining_depth - 1)

print(solve_recursive_step(3))`;
  }

  return `# ${lang} Code Implementation: Real-World Invariant Mapping for ${topic}
# Step 1: Initialize physical state variables
system_state = "INITIAL"
step_counter = 0

# Step 2: Invariant execution loop
while system_state != "GOAL_REACHED":
    step_counter += 1
    if step_counter >= 3:
        system_state = "GOAL_REACHED"

print(f"Execution complete: {topic} reached {system_state} in {step_counter} steps.")`;
}

/**
 * Sanitizes and normalizes panel lists to guarantee complete, rich panels.
 * CODE IS PLACED STRICTLY ON THE FINAL PANEL (Panels 1 to N-1 focus purely on story narrative).
 */
function sanitizePanels(panels: ComicPanelItem[], context: RuntimeContext, title: string): ComicPanelItem[] {
  const scenario = context.educationalAnalysis.scenarios[0];
  const topic = context.learningRequest.topic;
  const storySource = (scenario as any)?.storySource || topic;

  let cleaned = (panels || []).filter(p => p && (p.narrationBox || p.imagePrompt || p.storyProgress || p.purpose));

  // If fewer than 6 panels returned, interpolate with fallback panels
  if (cleaned.length < 6) {
    const fallback = createFallbackComicPanels(context, { title, storyOverview: scenario?.context || topic });
    let fallbackIdx = 0;
    while (cleaned.length < 6 && fallbackIdx < fallback.length) {
      cleaned.push(fallback[fallbackIdx]);
      fallbackIdx++;
    }
  }

  const lang = context.learningRequest.programmingLanguage || 'Python';
  const targetCsConcept = (scenario as any)?.targetCsConcept || `${topic} State Machine & Control Flow`;

  return cleaned.map((p, idx) => {
    const panelNum = idx + 1;
    const isLast = idx === cleaned.length - 1;

    const purpose = p.purpose && p.purpose.length > 3 
      ? p.purpose 
      : isLast 
        ? `${lang} Code Implementation & Concept Bridge` 
        : `Chapter ${panelNum}: Story Progression`;
    
    const narrationBox = p.narrationBox && p.narrationBox.trim().length > 10 
      ? p.narrationBox 
      : p.storyProgress && p.storyProgress.length > 10 
        ? p.storyProgress 
        : `As the narrative unfolds in ${storySource}, the real-world events progress through step ${panelNum}.`;
    
    const speechBubble = p.speechBubble || '';

    const imagePrompt = p.imagePrompt && p.imagePrompt.trim().length > 20 
      ? p.imagePrompt 
      : `An educational storybook illustration showing ${storySource} in Chapter ${panelNum}. ${purpose}. High detail, warm watercolor storybook style, 4K.`;

    // CODE AND CONCEPT BRIDGE COME STRICTLY ON THE FINAL PANEL
    let educationalGraphic: string | undefined = undefined;
    let codeSnippet: string | undefined = undefined;

    if (isLast) {
      educationalGraphic = p.educationalGraphic && !p.educationalGraphic.includes('essential skills')
        ? p.educationalGraphic
        : `💡 ${lang} Concept Alignment: ${targetCsConcept}`;

      const rawCode = p.codeSnippet || '';
      const isGenericCode = !rawCode || 
                            rawCode.length < 15 || 
                            rawCode.includes('perform_story_action') || 
                            rawCode.includes('item_count') ||
                            rawCode.includes('condition_met');

      if (isGenericCode) {
        codeSnippet = generateRealTopicCodeSnippet(topic, storySource, lang);
      } else {
        codeSnippet = rawCode;
      }
    }

    return {
      ...p,
      panelNumber: panelNum,
      purpose,
      narrationBox,
      speechBubble,
      imagePrompt,
      educationalGraphic,
      codeSnippet,
      negativePrompt: p.negativePrompt || 'low quality, dark, blurry, text errors, watermark, distorted face, extra limbs'
    };
  });
}

// ============================================================
// FALLBACK GENERATORS (Rich, not generic)
// ============================================================

function createFallbackComicPanels(context: RuntimeContext, bp: { title: string; storyOverview: string }): ComicPanelItem[] {
  const topic = context.learningRequest.topic || 'State Transitions & Accumulator Loops';
  const lang = context.learningRequest.programmingLanguage || 'Python';
  const userObs = context.learningRequest.userObservation || '';
  const scenario = context.educationalAnalysis?.scenarios?.[0] as any;
  const storySource = scenario?.storySource || userObs || topic;
  const lowerSource = (storySource + ' ' + userObs).toLowerCase();

  const suffix = 'Warm watercolor storybook illustration style, clean ink lines, soft detailed linework, warm golden tones, child-friendly, high detail, print-ready, 4K.';

  if (lowerSource.includes('crow') || lowerSource.includes('thirsty')) {
    return [
      {
        panelNumber: 1,
        purpose: 'Setting the Scene & The Physical Problem',
        storyProgress: 'Under a blazing midday sun, a thirsty crow flies low over parched fields and spots a tall ceramic pitcher with a tiny amount of water at the bottom.',
        learningPurpose: 'Observe initial physical state and condition gap (water level too low for beak).',
        narrationBox: 'Under a blazing midday sun, a thirsty crow flies over the parched fields searching for water. Spotting a tall ceramic pitcher sitting in a quiet courtyard, the crow alights on its rim with high hopes. However, looking down, it discovers the water level is sitting far below the reach of its beak.',
        speechBubble: '"The water is right there at the bottom, but my beak cannot reach it! I must find a way to bring the water level up to me."',
        characterEmotion: 'Determined & Observant — sharp eyes focused down into the pitcher',
        panelComposition: 'Medium shot of a glossy black crow perched on the narrow rim of a tall brown ceramic pitcher in a sun-drenched courtyard. A cutaway shows clear water far down at the bottom of the pitcher.',
        imagePrompt: `An educational storybook panel showing a thirsty crow perched on the narrow rim of a tall rustic ceramic pitcher in a sunlit Indian courtyard. The crow has glossy jet-black feathers, a sharp dark beak, and bright inquisitive eyes looking down with determination into the narrow neck of the pitcher. Through a clear cutaway view inside the pitcher, water sits low at the bottom, well out of reach. Small smooth grey pebbles lie scattered on the dusty ground nearby. Bright warm sunlight, warm watercolor style, clean outlines, high detail, 4K. ${suffix}`,
        negativePrompt: 'low quality, bad anatomy, distorted beak, extra limbs, text errors, watermark, dark, blurry'
      },
      {
        panelNumber: 2,
        purpose: 'First Physical Action & State Update',
        storyProgress: 'The crow picks up a pebble and drops it into the pitcher, causing the water level to rise by one increment.',
        learningPurpose: 'Discover state variable mutation: dropping a pebble updates water_level += pebble_volume.',
        narrationBox: 'Noticing small pebbles scattered across the courtyard floor, an ingenious idea strikes the crow. Picking up a single smooth stone in its beak, it drops it carefully into the neck of the pitcher. Plop! The submerged pebble displaces the liquid, causing the water level to rise by a small, measurable amount.',
        speechBubble: '"Dropping one pebble raises the water level by a small increment! If I repeat this action, the water will keep rising!"',
        characterEmotion: 'Resourceful & Excited — head tilted, beak dropping a stone',
        panelComposition: 'Close-up of the crow dropping a smooth grey pebble into the ceramic pitcher. Water ripples and rises slightly.',
        imagePrompt: `An educational storybook panel showing the glossy black crow dropping a small smooth stone into the neck of the ceramic pitcher. A gentle splash creates ripples on the water inside, and a subtle glowing indicator highlights the water level rising higher than before. Warm watercolor illustration style, high detail, child-friendly, 4K. ${suffix}`,
        negativePrompt: 'low quality, bad anatomy, text errors, watermark, distorted face'
      },
      {
        panelNumber: 3,
        purpose: 'Mental Model & Accumulator Loop',
        storyProgress: 'The crow repeatedly picks up pebbles and drops them into the pitcher, accumulating displacement until the threshold is reached.',
        learningPurpose: 'Establish Accumulator Loop model: repeat physical action while condition (water_level < THRESHOLD) is true.',
        narrationBox: 'The crow executes its strategy repeatedly: pick up a stone, drop it into the pitcher, and evaluate the new water height. With each stone dropped, the total volume accumulates steadily toward the rim.',
        speechBubble: '"Pick up stone -> drop stone -> check water level -> repeat until reachable threshold is met!"',
        characterEmotion: 'Focused & Methodical — steady rhythm of dropping stones',
        panelComposition: 'Medium shot showing a pile of stones accumulated at the bottom of the pitcher and the water level now near the top. An educational overlay illustrates the loop: Pick -> Drop -> Check.',
        imagePrompt: `An educational storybook panel showing the crow systematically dropping stones into the tall ceramic pitcher. Inside the cutaway pitcher, a pile of submerged grey pebbles rests at the bottom, and the water surface is now close to the top rim. An illuminated hand-drawn thought bubble above the crow shows a circular loop arrow: \'Drop Stone -> Water Rises -> Check Height\'. Warm watercolor style, print-ready, 4K. ${suffix}`,
        negativePrompt: 'low quality, bad anatomy, text errors, watermark'
      },
      {
        panelNumber: 4,
        purpose: 'Pattern Discovery & Concept Bridge',
        storyProgress: 'The physical fable maps directly to computational state variables, conditional threshold checks, and accumulator loops in Python.',
        learningPurpose: `Bridge physical observation to ${lang} code logic: while water_level < TARGET: water_level += increment.`,
        narrationBox: `What the Thirsty Crow demonstrates in the physical world is the exact blueprint of an Accumulator Loop and State Transitions in computer programming. In code, a state variable tracks progress while a loop executes actions until a target condition is satisfied.`,
        speechBubble: `"The physical state update \`water_level += 0.2\` inside a \`while water_level < TARGET:\` loop is identical to my pebble strategy!"`,
        characterEmotion: 'Enlightened & Triumphant — standing tall on rim',
        panelComposition: 'Medium shot of the crow perched proudly beside a glowing educational diagram connecting physical stones to Python code variables.',
        imagePrompt: `An educational storybook panel showing the crow perched proudly beside an open notebook resting on a stone bench. Above the notebook, a glowing glassmorphic educational overlay shows a clear flowchart bridging physical pebble dropping to Python state variables. Warm golden evening light, warm watercolor style, 4K. ${suffix}`,
        negativePrompt: 'low quality, bad anatomy, text errors, watermark',
        educationalGraphic: `💡 ${lang} Concept Bridge: Physical state updates (\`water_level += pebble_volume\`) in a loop map directly to Accumulator State Variables and \`while\` loops in ${lang}.`
      },
      {
        panelNumber: 5,
        purpose: 'Code Bridge & Smooth Alignment',
        storyProgress: 'The water reaches the rim, the crow drinks its fill, and the complete executable Python code is displayed.',
        learningPurpose: `Smoothly align story resolution with executable ${lang} code syntax.`,
        narrationBox: `The loop condition is satisfied — the target threshold is reached! The water level reaches the top rim of the pitcher, allowing the crow to quench its thirst. Physical natural law and ${lang} code execution align in complete harmony.`,
        speechBubble: `"Goal achieved! The condition became TRUE, the loop terminated, and thirst is quenched!"`,
        characterEmotion: 'Satisfied & Contented — drinking water happily',
        panelComposition: 'Wide shot of the crow sipping water comfortably from the top rim of the pitcher, with clean executable Python code floating in an emerald green panel overhead.',
        imagePrompt: `An educational storybook panel showing the crow sipping cool water comfortably from the top rim of the ceramic pitcher in the warm golden glow of sunset. Overhead, a sleek illuminated panel displays clean executable ${lang} code. Warm watercolor style, high detail, 4K. ${suffix}`,
        negativePrompt: 'low quality, bad anatomy, text errors, watermark',
        educationalGraphic: `💡 ${lang} Concept: Smooth Alignment — Physical State Transition maps to Executable ${lang} Control Flow`,
        codeSnippet: `# The Thirsty Crow: State Transitions & Accumulator Loop
water_level = 0.2
REACHABLE_THRESHOLD = 1.0

while water_level < REACHABLE_THRESHOLD:
    drop_pebble()
    water_level += 0.2  # Accumulator state transition

drink_water()  # Goal achieved!`
      }
    ];
  }

  // Dynamic Fallback using scenario's authentic characters and user story context
  const userStory = context.learningRequest.userObservation || context.learningRequest.experienceHints || '';
  const characters = scenario?.characters || (userStory.includes('Akbar') ? ['Emperor Akbar (Ruler)', 'Birbal (Wise Advisor)'] : ['Learner (Curious Observer)', 'Mentor (Wise Guide)']);
  const setting = scenario?.context || userStory || `An authentic setting exploring ${topic}`;
  const char1 = characters[0] || 'Learner';
  const char2 = characters[1] || 'Mentor';
  const comicSuffix = 'Classic Indian educational comic illustration, bold ink lines, flat vibrant colors, expressive faces, speech balloons, print-ready, 4K.';

  return [
    {
      panelNumber: 1,
      purpose: 'Setting the Scene & Misconception Hook',
      storyProgress: `${char1} encounters a crucial decision point in ${setting} where a condition must be evaluated.`,
      learningPurpose: `Observe the core decision mechanism of ${topic} in the real world.`,
      narrationBox: `In the court of ${setting}, a vital decision must be made. ${char1} observes how conditions determine outcomes.`,
      speechBubble: `"Before we act, we must check: Is the condition true or false?"`,
      characterEmotion: 'Curious & Thoughtful',
      panelComposition: `Wide comic panel showing ${char1} standing in ${setting}, observing the decision gate.`,
      imagePrompt: `A dynamic educational comic panel set in ${setting}. ${char1} stands in the center observing a decision process. ${comicSuffix}`,
      negativePrompt: 'low quality, dark, blurry, text errors, watermark'
    },
    {
      panelNumber: 2,
      purpose: 'Curiosity & Observation',
      storyProgress: `${char2} demonstrates how evaluating the condition leads to two distinct paths.`,
      learningPurpose: `Identify the conditional evaluation logic governing ${topic}.`,
      narrationBox: `If the condition is met, one path is taken. Otherwise, an alternative action occurs.`,
      speechBubble: `"If the rule holds TRUE, we execute Path A. Otherwise (ELSE), we execute Path B!"`,
      characterEmotion: 'Wise & Pointing Forward',
      panelComposition: `Medium comic panel showing ${char2} explaining the two distinct paths to ${char1}.`,
      imagePrompt: `A vibrant educational comic panel set in ${setting}. ${char2} points to two branching pathways while explaining to ${char1}. ${comicSuffix}`,
      negativePrompt: 'low quality, dark, blurry, text errors, watermark'
    },
    {
      panelNumber: 3,
      purpose: 'Mental Model Discovery',
      storyProgress: `${char1} connects the story event to the conceptual decision gate mental model.`,
      learningPurpose: `Establish core mental model for ${topic}.`,
      narrationBox: `Suddenly, the underlying rule becomes clear. The real-world decision acts as a living model for computation.`,
      speechBubble: `"I see! The decision gate controls the entire flow based on the condition!"`,
      characterEmotion: 'Triumphant Discovery',
      panelComposition: `Close-up comic panel of ${char1} with an illuminated decision gate graphic overhead.`,
      imagePrompt: `A dramatic educational comic panel capturing ${char1}'s moment of understanding in ${setting}, with a glowing decision graphic overhead. ${comicSuffix}`,
      negativePrompt: 'low quality, dark, blurry, text errors, watermark'
    },
    {
      panelNumber: 4,
      purpose: 'Pattern Discovery & Code Bridge',
      storyProgress: `The story actions map directly to ${lang} if-else syntax and state management.`,
      learningPurpose: `Bridge physical story observation to ${lang} code structures.`,
      narrationBox: `The decision logic in this story translates directly into executable ${lang} code.`,
      speechBubble: `"In ${lang}, IF evaluates the condition, and ELSE handles the alternative!"`,
      characterEmotion: 'Confident & Writing Code',
      panelComposition: `Medium comic panel of ${char1} writing ${lang} code in a parchment notebook.`,
      imagePrompt: `An educational comic panel showing ${char1} writing code in a notebook with glowing ${lang} syntax overlays in ${setting}. ${comicSuffix}`,
      negativePrompt: 'low quality, dark, blurry, text errors, watermark',
      educationalGraphic: `💡 ${lang} Concept Bridge: Physical decisions map directly to IF-ELSE control flow in ${lang}.`,
      codeSnippet: `# ${topic} Implementation
condition = True

if condition:
    print("Executing Path A: Condition Met!")
else:
    print("Executing Path B: Alternative Action!")`
    }
  ];
}

function createFallbackVideoScenes(context: RuntimeContext, bp: any): ScenePromptItem[] {
  const scenario = context.educationalAnalysis.scenarios[0] as any;
  const topic = context.learningRequest.topic;
  const suffix = bp.imagePromptSuffix || 'Pixar-quality 3D animation, ultra detailed, cinematic composition, global illumination, volumetric lighting, expressive faces, child-friendly, vibrant Indian colors, professional lighting, 8K.';
  const snapNeg = bp.snapVideoNegativePrompt || 'camera shake, face morphing, costume changing, teleportation, extra people, distorted movement, warping, flickering';

  return [
    {
      sceneNumber: 1,
      title: 'The Opening Discovery',
      duration: '8 seconds',
      summary: `A curious 10-year-old named Aarav approaches the authentic setting from the story. He notices something unusual and stops, watching carefully.`,
      refImagePrompt: `${scenario?.environmentBibleSeed || 'The grand entrance of Fatehpur Sikri during bright late morning. Towering red sandstone arched gateway with intricate Mughal carvings, massive wooden doors reinforced with black iron bands, royal flags fluttering in breeze, sandstone courtyard, bright blue sky.'}\n\nIn the foreground stands Aarav, a curious 10-year-old Indian boy with warm medium-brown skin, a round expressive face, short neatly combed black hair, large dark brown eyes filled with wonder and curiosity. He wears a light blue short-sleeved T-shirt, khaki knee-length shorts, clean white sneakers, and a small navy-blue backpack with both straps worn. His body language shows curiosity: head tilted slightly, one foot slightly forward, both hands loosely on backpack straps.\n\nCamera: Low-angle medium-wide establishing shot emphasizing the scale of the environment. 28mm cinematic wide-angle lens. Moderate depth of field. Warm golden morning sunlight. ${suffix}`,
      refImageNegativePrompt: 'low quality, bad anatomy, extra limbs, extra fingers, cropped, logo, watermark, text, duplicate character, distorted face, wrong costume, wrong lighting, oversaturated, AI artifacts, motion blur',
      snapVideoPrompt: `Aarav slowly walks three small steps toward the scene ahead, then gently stops and raises his head to look upward with growing wonder. His eyes widen and a soft smile appears. The camera performs one slow forward dolly toward Aarav. Environmental elements animate gently — flags sway, leaves flutter, birds glide across sky. Maintain one continuous feeling of curious wonder throughout. Realistic walking physics. Under 120 words.`,
      snapNegativePrompt: snapNeg,
      cameraDirection: 'Establishing Medium-Wide Shot. Low Angle. 28mm Wide Cinematic Lens. Slow Forward Dolly. Aarav centered in lower third, environment filling upper frame.',
      narration: 'Every great discovery begins with a single curious question.',
      dialogue: 'Aarav: "Wait... there is something different happening here every single time."',
      soundEffects: 'Soft footsteps on stone, gentle breeze, ambient birds chirping, distant atmosphere.',
      backgroundMusic: 'Warm orchestral theme with soft Indian flute and light tabla, creating curiosity and adventure.',
      educationalGraphics: '❓ "What happens here?"'
    },
    {
      sceneNumber: 2,
      title: 'The Pattern Revealed',
      duration: '8 seconds',
      summary: `The authentic story character demonstrates the pattern that maps to ${topic}. The learner observes the key mechanism for the first time.`,
      refImagePrompt: `The same authentic Mughal setting of Fatehpur Sikri. In the center stands ${scenario?.characters?.[1] || 'Birbal, Emperor Akbar\'s legendary advisor'} — ${scenario?.characterBibleSeed || 'a confident 45-year-old man with warm brown skin, neat black beard, sharp intelligent dark brown eyes. He wears elegant cream-colored court jama with gold embroidery, deep maroon silk sash, churidar trousers, mojri leather shoes.'} His right hand is raised in a deliberate gesture that communicates a decision being made.\n\nIn the left foreground, Aarav (10-year-old Indian boy, medium-brown skin, short black hair, light blue T-shirt, khaki shorts, white sneakers, navy backpack) watches the interaction with focused, wide-eyed attention, leaning forward slightly.\n\nBackground: Authentic Mughal architecture — carved sandstone columns, ornate jali screens casting latticed golden light, silk-draped courtiers standing attentively in the distance. Warm late-morning golden sunlight streaming from the upper right.\n\nCamera: Eye-level medium-wide cinematic shot. 35mm lens. Moderate depth of field. ${suffix}`,
      refImageNegativePrompt: 'low quality, bad anatomy, extra limbs, extra fingers, cropped, logo, watermark, text, duplicate character, distorted face, wrong costume, wrong lighting, oversaturated, AI artifacts, motion blur',
      snapVideoPrompt: `${scenario?.characters?.[1]?.split('(')[0] || 'Birbal'} slowly raises his right hand in a calm deliberate gesture while maintaining a straight authoritative posture. His expression shifts from neutral to a subtle knowing smile. Aarav remains still, watching with intensely focused curiosity. The camera performs one slow left-to-right pan revealing the full scene. Flags flutter gently, golden light rays shift slightly. One continuous emotion of calm authority. Realistic cloth movement.`,
      snapNegativePrompt: snapNeg,
      cameraDirection: 'Medium-Wide Character Shot. Eye Level. 35mm Cinematic Lens. Slow Left-to-Right Pan.',
      narration: 'Before any action, something is always checked. Always.',
      dialogue: `${scenario?.characters?.[1]?.split('(')[0] || 'Birbal'}: "A wise mind never acts without first evaluating the condition."`,
      soundEffects: 'Gentle palace ambience, soft cloth rustle, distant birds, subtle wind.',
      backgroundMusic: 'Warm orchestral with Indian flute, soft strings, gentle tabla, building anticipation.',
      educationalGraphics: '👁️ "Observe carefully..."'
    }
  ];
}

// ============================================================
// MARKDOWN RENDERERS
// ============================================================

function renderComicMarkdown(context: RuntimeContext, bp: any, panels: ComicPanelItem[]): string {
  const topic = context.learningRequest.topic;
  const lang = context.learningRequest.programmingLanguage || 'Python';

  return `# ${bp.title}

## About This Comic
- **Learning Goal:** ${topic}
- **Target Audience:** Learner — Knowledge is for everyone
- **Mental Model:** ${context.educationalAnalysis.mentalModel?.modelName} — *"${context.educationalAnalysis.mentalModel?.coreAnalogy}"*
- **Story DNA:** ${(context.educationalAnalysis.scenarios[0] as any)?.storySource || 'Authentic domain story'}

---

## Story Overview
${bp.storyOverview}

---

## Comic Script & Panels

${panels.map(p => `
---

### Panel ${p.panelNumber}: ${p.purpose}

**📖 Narration Box**
> *${p.narrationBox}*

**💬 Character Dialogue**
> "${p.speechBubble}"

**🎭 Character Emotion:** ${p.characterEmotion}

**🎬 Panel Composition**
${p.panelComposition}

**🖼️ Copy-Paste AI Image Prompt**
\`\`\`
${p.imagePrompt}
\`\`\`

**🚫 Negative Prompt**
\`\`\`
${p.negativePrompt}
\`\`\`
${(p as any).educationalGraphic ? `\n**📊 Educational Graphic:** ${(p as any).educationalGraphic}` : ''}
${(p as any).codeSnippet ? `\n**💻 Code Snippet**\n\`\`\`${lang.toLowerCase()}\n${(p as any).codeSnippet}\n\`\`\`` : ''}
`).join('\n')}

---

## Key Takeaway
${context.educationalAnalysis.mentalModel?.description || `Always understand the mechanism of ${topic} before writing the code.`}

## Practice Activity
Try applying what you observed in the story to predict what the code will do next!
`;
}

function renderVideoMarkdown(context: RuntimeContext, bp: any, scenes: ScenePromptItem[]): string {
  return `# ${bp.title} — Video Production Script

## Story Overview
${bp.storyOverview}

---

${scenes.map(s => `
---

## Scene ${s.sceneNumber}: ${s.title} *(${s.duration})*

**Summary:** ${s.summary}

### Narration
> *"${s.narration}"*

### Dialogue
${s.dialogue || '*[No dialogue — visual narration only]*'}

### Reference Image Prompt (Copy-Paste Ready)
\`\`\`
${s.refImagePrompt}
\`\`\`

### Reference Image Negative Prompt
\`\`\`
${s.refImageNegativePrompt}
\`\`\`

### SnapGenAI Video Prompt
\`\`\`
${s.snapVideoPrompt}
\`\`\`

### SnapGenAI Negative Prompt
\`\`\`
${s.snapNegativePrompt}
\`\`\`

### Camera Direction
${s.cameraDirection}

### Sound Effects
${s.soundEffects}

### Background Music
${s.backgroundMusic}

### Educational Graphics
${s.educationalGraphics || '*[None for this scene]*'}
`).join('\n')}

---

## Production Notes
- Visual Style: Stylized educational 3D animation with cultural authenticity
- Aspect Ratio: 16:9
- Narration: Single warm storyteller voice
- Transitions: Smooth, culturally resonant
`;
}

function renderStorybookMarkdown(context: RuntimeContext, title: string, panels: ComicPanelItem[]): string {
  const lang = context.learningRequest.programmingLanguage || 'Python';
  const topic = context.learningRequest.topic || 'CS Concept';

  return `# ${title} — Storybook & Pedagogical Code Bridge

${panels.map(p => `
---

## Chapter ${p.panelNumber}: ${p.purpose}

### Story Narrative
${p.narrationBox}

> **"${p.speechBubble}"**

${p.educationalGraphic ? `### 💡 ${lang} Concept Bridge\n> **${p.educationalGraphic}**\n` : ''}
${p.codeSnippet ? `### 💻 ${lang} Code Implementation\n\`\`\`${lang.toLowerCase()}\n${p.codeSnippet}\n\`\`\`\n` : ''}
### Illustration Prompt (Copy-Paste Ready)
\`\`\`
${p.imagePrompt}
\`\`\`
`).join('\n')}

---

## 🎯 Summary Code Connection
In this storybook, every physical event in the story maps directly to **${lang}** code logic for **${topic}**.
Just like the real-world story actions, computer code uses state variables to track progress, conditions to check thresholds, and loops to repeat operations until a goal is reached.
`;
}
