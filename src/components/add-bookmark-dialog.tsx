'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Verse, Bookmark, BookmarkGroup } from '@/lib/types';

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, note: string, groupId: string | null) => void;
  verseData?: { version: string; book: string; chapter: number; verse: Verse } | null;
  existingBookmark?: Bookmark | null;
  groups: BookmarkGroup[];
  uncategorizedGroupId: string;
}

export default function AddBookmarkDialog({
  isOpen,
  onClose,
  onSave,
  verseData,
  existingBookmark,
  groups,
  uncategorizedGroupId
}: AddBookmarkDialogProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [groupId, setGroupId] = useState<string | null>(uncategorizedGroupId);

  const data = existingBookmark ? {
      book: existingBookmark.book,
      chapter: existingBookmark.chapter,
      verse: { verse: existingBookmark.verse, text: existingBookmark.text },
  } : verseData;
  
  const isEditing = !!existingBookmark;

  useEffect(() => {
    if (isOpen) {
        if(isEditing && existingBookmark) {
            setTitle(existingBookmark.title);
            setNote(existingBookmark.note);
            setGroupId(existingBookmark.groupId ?? uncategorizedGroupId);
        } else if (verseData) {
            setTitle(`${verseData.book} ${verseData.chapter}:${verseData.verse.verse}`);
            setNote('');
            setGroupId(uncategorizedGroupId);
        }
    }
  }, [isOpen, verseData, isEditing, existingBookmark, uncategorizedGroupId]);
  

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, note, groupId);
      onClose();
    }
  };

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Bookmark" : "Add Bookmark"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for your bookmark." : "Save this verse with a custom title and notes."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 rounded-md border bg-muted p-4 text-sm italic">
            "{data.verse.text}"
            <span className="mt-2 block text-right font-semibold not-italic text-primary">
              - {data.book} {data.chapter}:{data.verse.verse}
            </span>
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a title for your bookmark"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select value={groupId ?? uncategorizedGroupId} onValueChange={(value) => setGroupId(value)}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <Textarea
                id="note"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add personal notes or reflections (optional)"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {isEditing ? 'Save Changes' : 'Save Bookmark'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
