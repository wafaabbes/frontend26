'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/app/contexts/notes-context';
import { useUI } from '@/app/contexts/ui-context';
import { Button } from '@/components/ui/button';
import { Plus, File, Tag, Settings } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const { notes, tags, fetchNotes, fetchTags } = useNotes();
  const { setSidebarOpen } = useUI();

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, []);

  const recentNotes = notes.slice(0, 5);

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-foreground mb-4">
          <File className="w-5 h-5 text-primary" />
          NotesVerb
        </Link>
        <Button
          onClick={() => router.push('/dashboard/new')}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-4">
        {/* Recent Notes Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Recent Notes
          </h3>
          <div className="space-y-1">
            {recentNotes.length > 0 ? (
              recentNotes.map(note => (
                <Link
                  key={note.id}
                  href={`/dashboard/notes/${note.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors truncate"
                >
                  {note.title || 'Untitled'}
                </Link>
              ))
            ) : (
              <p className="text-xs text-muted-foreground px-3 py-2">No notes yet</p>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Tags
          </h3>
          <div className="space-y-1">
            {tags.length > 0 ? (
              tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/dashboard/tags/${tag.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{tag.name}</span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-muted-foreground px-3 py-2">No tags yet</p>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors w-full"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
