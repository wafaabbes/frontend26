'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotes } from '@/app/contexts/notes-context';
import { Button } from '@/components/ui/button';
import RichEditor from '@/components/rich-editor';
import TagManager from '@/components/tag-manager';
import { ArrowLeft, Save, Trash2, ChevronRight } from 'lucide-react';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const { notes, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setOriginalTitle(note.title);
      setOriginalContent(note.content);
    }
  }, [noteId, notes]);

  const hasChanges = title !== originalTitle || content !== originalContent;

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateNote(noteId, title, content);
      setOriginalTitle(title);
      setOriginalContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote(noteId);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete note');
      }
    }
  };

  const note = notes.find(n => n.id === noteId);

  if (!note) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
              variant="ghost"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
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

      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-80 border-l border-border bg-card overflow-auto p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Note Details</h2>
          <TagManager noteId={noteId} />
        </div>
      )}
    </div>
  );
}
