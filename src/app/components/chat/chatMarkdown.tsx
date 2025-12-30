import React from 'react';

/**
 * Parse and render markdown-style formatting in chat messages
 * Supports: **bold**, *italic*, ***bold+italic***
 */
export function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let keyCounter = 0;

  // Pattern matches: ***text***, **text**, or *text*
  const markdownPattern = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
  
  let match;
  while ((match = markdownPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {text.substring(currentIndex, match.index)}
        </span>
      );
    }

    const matchedText = match[0];
    
    // Check for bold+italic (***text***)
    if (matchedText.startsWith('***') && matchedText.endsWith('***')) {
      const content = matchedText.slice(3, -3);
      parts.push(
        <strong key={`bold-italic-${keyCounter++}`} className="font-bold italic">
          {content}
        </strong>
      );
    }
    // Check for bold (**text**)
    else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      const content = matchedText.slice(2, -2);
      parts.push(
        <strong key={`bold-${keyCounter++}`} className="font-bold">
          {content}
        </strong>
      );
    }
    // Check for italic (*text*)
    else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
      const content = matchedText.slice(1, -1);
      parts.push(
        <em key={`italic-${keyCounter++}`} className="italic">
          {content}
        </em>
      );
    }

    currentIndex = match.index + matchedText.length;
  }

  // Add remaining text after last match
  if (currentIndex < text.length) {
    parts.push(
      <span key={`text-${keyCounter++}`}>
        {text.substring(currentIndex)}
      </span>
    );
  }

  // If no markdown found, return plain text
  return parts.length > 0 ? parts : [text];
}

/**
 * Component to render formatted message text
 */
interface FormattedMessageProps {
  text: string;
  className?: string;
}

export function FormattedMessage({ text, className }: FormattedMessageProps) {
  const formatted = parseMarkdown(text);
  
  return (
    <div className={className}>
      {formatted}
    </div>
  );
}
