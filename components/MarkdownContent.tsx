"use client";

import { useMemo } from "react";

interface MarkdownContentProps {
  content: string;
}

// Simple markdown parser - handles common markdown syntax
function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Escape HTML (except what we're about to generate)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Tables
  html = html.replace(
    /^\|(.+)\|\s*\n\|[-:\s|]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm,
    (_, header, body) => {
      const headers = header
        .split("|")
        .filter((h: string) => h.trim())
        .map((h: string) => `<th class="px-4 py-2 text-left">${h.trim()}</th>`)
        .join("");
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td class="px-4 py-2 border-t border-zinc-200 dark:border-zinc-700">${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<div class="overflow-x-auto my-6"><table class="min-w-full text-sm"><thead class="bg-zinc-50 dark:bg-zinc-800"><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
  );

  // Code blocks (```code```)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$2</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">$1</code>'
  );

  // Details/Summary (spoiler blocks)
  html = html.replace(
    /&lt;details&gt;\s*\n&lt;summary&gt;(.+?)&lt;\/summary&gt;\s*\n([\s\S]*?)&lt;\/details&gt;/g,
    '<details class="my-4 rounded-lg border border-zinc-200 dark:border-zinc-700"><summary class="cursor-pointer px-4 py-2 font-medium bg-zinc-50 dark:bg-zinc-800 rounded-t-lg">$1</summary><div class="px-4 py-3">$2</div></details>'
  );

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>');

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links - internal links with relative URLs
  html = html.replace(
    /\[([^\]]+)\]\(\/([^)]+)\)/g,
    '<a href="/$2" class="text-emerald-600 dark:text-emerald-400 hover:underline">$1</a>'
  );
  
  // Links - external
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 hover:underline">$1</a>'
  );

  // Unordered lists
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-4">$1</li>'
  );
  html = html.replace(
    /(<li class="ml-4">.*<\/li>\n?)+/g,
    '<ul class="list-disc list-inside my-4 space-y-1">$&</ul>'
  );

  // Ordered lists
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-4">$1</li>'
  );

  // Checkboxes
  html = html.replace(
    /- ✅ (.+)$/gm,
    '<li class="ml-4 flex items-start gap-2"><span class="text-emerald-500">✓</span><span>$1</span></li>'
  );
  html = html.replace(
    /- ❌ (.+)$/gm,
    '<li class="ml-4 flex items-start gap-2"><span class="text-red-500">✗</span><span>$1</span></li>'
  );

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-emerald-500 pl-4 py-1 my-4 text-zinc-600 dark:text-zinc-400 italic">$1</blockquote>'
  );
  // Merge consecutive blockquotes
  html = html.replace(
    /<\/blockquote>\n<blockquote class="border-l-4 border-emerald-500 pl-4 py-1 my-4 text-zinc-600 dark:text-zinc-400 italic">/g,
    '<br/>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-8 border-zinc-200 dark:border-zinc-700" />');

  // Paragraphs - wrap remaining text blocks
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, "<p>$1</p>");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  // Clean up paragraphs around block elements
  html = html.replace(/<p>(<(?:h[1-6]|ul|ol|div|pre|details|table|hr)[^>]*>)/g, "$1");
  html = html.replace(/(<\/(?:h[1-6]|ul|ol|div|pre|details|table|hr)>)<\/p>/g, "$1");

  return html;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
