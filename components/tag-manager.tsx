'use client';

import React, { useState } from 'react';
import { useNotes } from '@/app/contexts/notes-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag as TagIcon } from 'lucide-react';

interface TagManagerProps {
  noteId?: string;
  onTagsChange?: (tags: string[]) => void;
}

export default function TagManager({ noteId, onTagsChange }: TagManagerProps) {
  const { tags, createTag, addTagToNote, removeTagFromNote, notes } = useNotes();
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [tagColor, setTagColor] = useState('#56198F');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const note = noteId ? notes.find(n => n.id === noteId) : null;
  const noteTags = note?.tags || [];

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError('Tag name is required');
      return;
    }

    if (tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase())) {
      setError('Tag already exists');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newTag = await createTag(newTagName, tagColor);
      
      if (noteId) {
        await addTagToNote(noteId, newTag.id);
        if (onTagsChange) {
          onTagsChange([...noteTags.map(t => t.id), newTag.id]);
        }
      }

      setNewTagName('');
      setShowNewTag(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTagToNote = async (tagId: string) => {
    if (!noteId) return;

    try {
      await addTagToNote(noteId, tagId);
      if (onTagsChange) {
        onTagsChange([...noteTags.map(t => t.id), tagId]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tag');
    }
  };

  const handleRemoveTagFromNote = async (tagId: string) => {
    if (!noteId) return;

    try {
      await removeTagFromNote(noteId, tagId);
      if (onTagsChange) {
        onTagsChange(noteTags.filter(t => t.id !== tagId).map(t => t.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove tag');
    }
  };

  const availableTags = tags.filter(t => !noteTags.some(nt => nt.id === t.id));

  return (
    <div className="space-y-4">
      {/* Current Tags */}
      {noteId && noteTags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Note Tags</h3>
          <div className="flex flex-wrap gap-2">
            {noteTags.map(tag => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground"
              >
                <TagIcon className="w-3 h-3" />
                {tag.name}
                <button
                  onClick={() => handleRemoveTagFromNote(tag.id)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      {noteId && availableTags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Available Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleAddTagToNote(tag.id)}
                className="px-3 py-1 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary transition-colors"
              >
                <Plus className="w-3 h-3 inline mr-1" />
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New Tag Form */}
      {showNewTag ? (
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Create New Tag</h3>
          <Input
            type="text"
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="bg-background border-border text-foreground placeholder-muted-foreground"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-foreground">Color:</label>
            <input
              type="color"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleCreateTag}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              {loading ? 'Creating...' : 'Create Tag'}
            </Button>
            <Button
              onClick={() => {
                setShowNewTag(false);
                setNewTagName('');
                setError('');
              }}
              variant="outline"
              size="sm"
              className="border-border"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowNewTag(true)}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Tag
        </Button>
      )}

      {/* All Tags List */}
      {!noteId && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">All Tags ({tags.length})</h3>
          {tags.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {tags.map(tag => (
                <div
                  key={tag.id}
                  className="px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground flex items-center justify-between"
                >
                  <span className="truncate">{tag.name}</span>
                  {tag.color && (
                    <div
                      className="w-3 h-3 rounded-full ml-2"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags yet. Create your first tag above.</p>
          )}
        </div>
      )}
    </div>
  );
}
