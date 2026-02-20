'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/app/contexts/notes-context';
import { Button } from '@/components/ui/button';
import RichEditor from '@/components/rich-editor';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewNotePage() {
  const router = useRouter();
  const { createNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const newNote = await createNote(title, content);
      router.push(`/dashboard/notes/${newNote.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <RichEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
      />
    </div>
  );
}
