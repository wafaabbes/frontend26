'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface NotesContextType {
  notes: Note[];
  selectedNote: Note | null;
  tags: Tag[];
  loading: boolean;
  error: string | null;
  
  // Note operations
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string) => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (note: Note | null) => void;
  
  // Tag operations
  fetchTags: () => Promise<void>;
  createTag: (name: string, color?: string) => Promise<Tag>;
  addTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  
  // Search & filter
  searchNotes: (query: string) => Note[];
  filterByTag: (tagId: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const fetchNotes = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/notes', {
        headers,
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string): Promise<Note> => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch('http://localhost:8080/notes', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error('Failed to create note');
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      return newNote;
    } catch (err) {
      throw err;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch(`http://localhost:8080/notes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error('Failed to update note');
      const updated = await response.json();
      setNotes(notes.map(n => n.id === id ? updated : n));
      if (selectedNote?.id === id) setSelectedNote(updated);
    } catch (err) {
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch(`http://localhost:8080/notes/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error('Failed to delete note');
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (err) {
      throw err;
    }
  };

  const fetchTags = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/tags', {
        headers,
      });
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string, color?: string): Promise<Tag> => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch('http://localhost:8080/tags', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, color }),
      });
      if (!response.ok) throw new Error('Failed to create tag');
      const newTag = await response.json();
      setTags([...tags, newTag]);
      return newTag;
    } catch (err) {
      throw err;
    }
  };

  const addTagToNote = async (noteId: string, tagId: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch(
        `http://localhost:8080/notes/${noteId}/tags/${tagId}`,
        {
          method: 'POST',
          headers,
        }
      );
      if (!response.ok) throw new Error('Failed to add tag');
      await fetchNotes();
    } catch (err) {
      throw err;
    }
  };

  const removeTagFromNote = async (noteId: string, tagId: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await fetch(
        `http://localhost:8080/notes/${noteId}/tags/${tagId}`,
        {
          method: 'DELETE',
          headers,
        }
      );
      if (!response.ok) throw new Error('Failed to remove tag');
      await fetchNotes();
    } catch (err) {
      throw err;
    }
  };

  const searchNotes = (query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByTag = (tagId: string): Note[] => {
    return notes.filter(note => note.tags.some(tag => tag.id === tagId));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedNote,
        tags,
        loading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        selectNote: setSelectedNote,
        fetchTags,
        createTag,
        addTagToNote,
        removeTagFromNote,
        searchNotes,
        filterByTag,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
}
