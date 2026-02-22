'use client';

import React, { useEffect, useState } from 'react';
import { useNotes } from '@/app/contexts/notes-context';
import { Button } from '@/components/ui/button';
import NotesList from '@/components/notes-list';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { notes, fetchNotes, tags } = useNotes();
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    fetchNotes();
  }, []);

  const filterNotes = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return notes.filter(note => {
      const noteDate = new Date(note.updatedAt);
      const noteDateNormalized = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

      switch (viewMode) {
        case 'today':
          return noteDateNormalized.getTime() === today.getTime();
        case 'week':
          return noteDateNormalized.getTime() >= weekAgo.getTime();
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredNotes = filterNotes();
  const stats = {
    total: notes.length,
    today: notes.filter(n => {
      const today = new Date();
      const noteDate = new Date(n.updatedAt);
      return noteDate.toDateString() === today.toDateString();
    }).length,
    tags: tags.length,
  };

  return (
    <div className="p-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Notes</h1>
          <p className="text-muted-foreground">
            You have <span className="font-semibold">{stats.total}</span> notes and{' '}
            <span className="font-semibold">{stats.tags}</span> tags
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground text-sm font-medium">Total Notes</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground text-sm font-medium">Today</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.today}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground text-sm font-medium">Tags</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.tags}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:border-primary'
          }`}
        >
          All Notes
        </button>
        <button
          onClick={() => setViewMode('today')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'today'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:border-primary'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'week'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:border-primary'
          }`}
        >
          This Week
        </button>
      </div>

      {/* Notes List */}
      <NotesList notes={filteredNotes} />
    </div>
  );
}
