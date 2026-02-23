import React, { useRef, useEffect } from 'react';

interface EditableTextProps {
  initialValue: string;
  onSave: (value: string) => void;
  className?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function EditableText({
  initialValue,
  onSave,
  className = '',
  multiline = false,
  style,
  tagName = 'div'
}: EditableTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (elementRef.current && !isEditingRef.current) {
      if (elementRef.current.innerText !== initialValue) {
        elementRef.current.innerText = initialValue;
      }
    }
  }, [initialValue]);

  const handleFocus = () => {
    isEditingRef.current = true;
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    if (elementRef.current) {
      const newText = elementRef.current.innerText;
      // Only save if content changed significantly (trim check) or is different
      if (newText !== initialValue) {
        onSave(newText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.innerText = initialValue;
        elementRef.current.blur();
      }
    }
  };

  const Tag = tagName as any;

  return (
    <Tag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-colors cursor-text hover:bg-black/5 rounded-sm px-1 -mx-1 ${className}`}
      style={style}
    >
      {initialValue}
    </Tag>
  );
}
