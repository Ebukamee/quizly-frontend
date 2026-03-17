"use client";

import { useMemo } from "react";
import katex from "katex";

type Props = {
  text: string;
  className?: string;
};

/**
 * Renders a string that may contain LaTeX math delimiters:
 *   $$...$$ → display mode
 *   $...$   → inline mode
 * Non-math text is rendered as plain text.
 */
export default function LatexRenderer({ text, className = "" }: Props) {
  const html = useMemo(() => {
    // Split on $$...$$ first (display), then $...$ (inline)
    const parts: { type: "text" | "display" | "inline"; content: string }[] = [];
    let remaining = text || '';

    while (remaining.length > 0) {
      const displayIdx = remaining.indexOf("$$");
      const inlineIdx = remaining.indexOf("$");

      if (displayIdx !== -1 && (inlineIdx === -1 || displayIdx <= inlineIdx)) {
        // Text before $$
        if (displayIdx > 0) {
          parts.push({ type: "text", content: remaining.slice(0, displayIdx) });
        }
        const endIdx = remaining.indexOf("$$", displayIdx + 2);
        if (endIdx === -1) {
          parts.push({ type: "text", content: remaining.slice(displayIdx) });
          remaining = "";
        } else {
          parts.push({ type: "display", content: remaining.slice(displayIdx + 2, endIdx) });
          remaining = remaining.slice(endIdx + 2);
        }
      } else if (inlineIdx !== -1) {
        // Text before $
        if (inlineIdx > 0) {
          parts.push({ type: "text", content: remaining.slice(0, inlineIdx) });
        }
        const endIdx = remaining.indexOf("$", inlineIdx + 1);
        if (endIdx === -1) {
          parts.push({ type: "text", content: remaining.slice(inlineIdx) });
          remaining = "";
        } else {
          parts.push({ type: "inline", content: remaining.slice(inlineIdx + 1, endIdx) });
          remaining = remaining.slice(endIdx + 1);
        }
      } else {
        parts.push({ type: "text", content: remaining });
        remaining = "";
      }
    }

    return parts
      .map((p) => {
        if (p.type === "text") {
          // Escape HTML in plain text
          return p.content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }
        try {
          return katex.renderToString(p.content, {
            throwOnError: false,
            displayMode: p.type === "display",
            output: "html",
          });
        } catch {
          return p.content;
        }
      })
      .join("");
  }, [text]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
