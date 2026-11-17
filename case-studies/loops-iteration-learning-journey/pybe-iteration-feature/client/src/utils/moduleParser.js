/**
 * Utility to parse markdown content files into structured Beat objects
 * according to content-file-grammer.md, with error tolerance for unclosed code fences.
 */

export function parseModuleMD(rawText) {
  if (!rawText) return [];

  const lines = rawText.split('\n');
  const beatSections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match header lines like # Beat N of M or ## Beat N of M
    const match = line.match(/^#{1,6}\s+Beat\s+(\d+)\s+of\s+(\d+)/i);
    if (match) {
      if (currentSection) {
        beatSections.push(currentSection);
      }
      currentSection = {
        beatNumber: parseInt(match[1], 10),
        totalBeats: parseInt(match[2], 10),
        lines: []
      };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  if (currentSection) {
    beatSections.push(currentSection);
  }

  return beatSections.map((section) => {
    const textBlock = section.lines.join('\n');

    // Parse left-pane block
    let leftPane = { type: 'text', content: '' };
    const leftPaneMatch = textBlock.match(/left-pane\s*:\s*\{([\s\S]*?)\}/i);
    if (leftPaneMatch) {
      const leftContent = leftPaneMatch[1];
      const typeMatch = leftContent.match(/type\s*:\s*["'](image|text)["']/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : 'text';

      if (type === 'image') {
        const srcMatch = leftContent.match(/src\s*:\s*["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : '';
        leftPane = { type: 'image', src };
      } else {
        const backtickMatch = leftContent.match(/content\s*:\s*`([\s\S]*?)`/i);
        if (backtickMatch) {
          leftPane = { type: 'text', content: backtickMatch[1] };
        } else {
          const stringMatch = leftContent.match(/content\s*:\s*["']([\s\S]*?)["']/i);
          leftPane = { type: 'text', content: stringMatch ? stringMatch[1] : '' };
        }
      }
    }

    // Parse right-pane block
    // Tolerate missing closing ``` code fences (as seen in Beat 10)
    let rightPaneHtml = '';
    const rightPaneMatch = textBlock.match(/right-pane\s*:\s*(?:```html)?([\s\S]*?)(?:```|\s*$)/i);
    if (rightPaneMatch) {
      rightPaneHtml = rightPaneMatch[1].trim();
    }

    const hasMcq = /<z-mcq[\s>]/i.test(rightPaneHtml);

    return {
      beatNumber: section.beatNumber,
      totalBeats: section.totalBeats,
      leftPane,
      rightPaneHtml,
      hasMcq
    };
  });
}
