'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
} from 'lucide-react';

interface RichEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

export default function RichEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const updateContent = (newContent: string) => {
    if (editorRef.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onContentChange(newContent);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      updateContent(editorRef.current.innerHTML);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        onContentChange(history[newIndex]);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
        onContentChange(history[newIndex]);
      }
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      updateContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Title Input */}
      <div className="p-6 border-b border-border bg-card">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-3xl font-bold bg-card border-0 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 p-0 mb-2 h-auto"
        />
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-4 bg-card border-b border-border flex-wrap">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="text-muted-foreground hover:text-foreground"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="text-muted-foreground hover:text-foreground"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'h1')}
          className="text-muted-foreground hover:text-foreground"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'h2')}
          className="text-muted-foreground hover:text-foreground"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('bold')}
          className="text-muted-foreground hover:text-foreground"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('italic')}
          className="text-muted-foreground hover:text-foreground"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('insertUnorderedList')}
          className="text-muted-foreground hover:text-foreground"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('insertOrderedList')}
          className="text-muted-foreground hover:text-foreground"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'blockquote')}
          className="text-muted-foreground hover:text-foreground"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'pre')}
          className="text-muted-foreground hover:text-foreground"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        onInput={handleEditorInput}
        contentEditable
        suppressContentEditableWarning
        className="flex-1 p-6 bg-background text-foreground focus:outline-none overflow-auto prose prose-invert max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:mt-3 [&_h2]:mb-2 [&_p]:text-base [&_p]:line-height-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-auto"
      />
    </div>
  );
}
