import type { ReactNode } from 'react';

/**
 * Minimal inline formatting for CMS-authored text. Supports exactly two
 * tokens — **bold** and __accent__ — rendered as styled spans. No raw HTML is
 * ever parsed, which eliminates XSS from CMS content by construction.
 */
export function renderInlineText(text: string): ReactNode {
  // Split on both token types while keeping delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <span key={i} className="text-white font-bold italic">
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith('__') && part.endsWith('__') && part.length > 4) {
      return (
        <span
          key={i}
          className="font-bold underline decoration-lime decoration-4 underline-offset-8"
        >
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

/** Splits a body of text into paragraphs on blank lines. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
