'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotes } from '@/app/contexts/notes-context';
import NotesList from '@/components/notes-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TagPage() {
  const params = useParams();
  const router = useRouter();
  const tagId = params.id as string;
  const { tags, filterByTag, fetchNotes } = useNotes();

  useEffect(() => {
    fetchNotes();
  }, []);

  const tag = tags.find(t => t.id === tagId);
  const notes = filterByTag(tagId);

  if (!tag) {
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
        <p className="text-muted-foreground">Tag not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground mb-4">
          {tag.name}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Notes tagged with "{tag.name}"
        </h1>
        <p className="text-muted-foreground">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} with this tag
        </p>
      </div>

      <NotesList notes={notes} />
    </div>
  );
}
