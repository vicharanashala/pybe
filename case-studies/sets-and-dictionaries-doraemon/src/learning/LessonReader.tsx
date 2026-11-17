import React from 'react';

interface LessonReaderProps {
  content: string;
}

// Internal Markdown parser helper
function parseMarkdown(text: string): string {
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold markdown
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Code Blocks
  html = html.replace(/```python([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // List items (hyphens or asterisks)
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

  // Wrap list items in <ul> tags
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/gs, '<ul>$1</ul>');

  // Process normal paragraphs
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h') || 
      trimmed.startsWith('<pre') || 
      trimmed.startsWith('</pre') || 
      trimmed.startsWith('<code') || 
      trimmed.startsWith('</code') || 
      trimmed.startsWith('<ul') || 
      trimmed.startsWith('</ul') || 
      trimmed.startsWith('<li') || 
      trimmed.startsWith('</li')
    ) {
      return line;
    }
    return `<p>${line}</p>`;
  });

  return processedLines.join('\n');
}

export const LessonReader: React.FC<LessonReaderProps> = ({ content }) => {
  return (
    <div 
      className="md-content animate-fade-in"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};
export default LessonReader;
