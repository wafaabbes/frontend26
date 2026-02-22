'use client';

import React, { useEffect } from 'react';
import { useNotes } from '@/app/contexts/notes-context';
import TagManager from '@/components/tag-manager';

export default function TagsPage() {
  const { fetchTags } = useNotes();

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Tags</h1>
        <p className="text-muted-foreground mb-8">
          Create, organize, and manage all your note tags in one place
        </p>

        <div className="bg-card border border-border rounded-lg p-6">
          <TagManager />
        </div>
      </div>
    </div>
  );
}
