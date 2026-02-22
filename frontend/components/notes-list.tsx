'use client';

import React from 'react';
import Link from 'next/link';
import { useNotes } from '@/app/contexts/notes-context';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Tag, FileText } from 'lucide-react';

interface NotesListProps {
  notes?: any[];
  isLoading?: boolean;
}

export default function NotesList({ notes: propNotes, isLoading: propLoading }: NotesListProps) {
  const { notes: contextNotes, loading: contextLoading, deleteNote } = useNotes();
  
  const notes = propNotes || contextNotes;
  const loading = propLoading !== undefined ? propLoading : contextLoading;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first note to get started organizing your ideas
        </p>
        <Link href="/dashboard/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create First Note
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map(note => (
        <Link
          key={note.id}
          href={`/dashboard/notes/${note.id}`}
          className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors hover:shadow-sm"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate mb-1">
                {note.title || 'Untitled'}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {note.content || 'No content'}
              </p>
              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {note.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground"
                    >
                      <Tag className="w-3 h-3" />
                      {tag.name}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground py-1">
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Date & Actions */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {formatDate(note.updatedAt)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDelete(note.id, e)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
