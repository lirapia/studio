'use client';

import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { BookmarkGroup } from '@/lib/types';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ManageGroupsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groups: BookmarkGroup[];
  addGroup: (title: string) => void;
  updateGroup: (id: string, title: string) => void;
  deleteGroup: (id: string) => void;
  uncategorizedGroupId: string;
}

export function ManageGroupsDialog({
  isOpen,
  onClose,
  groups,
  addGroup,
  updateGroup,
  deleteGroup,
  uncategorizedGroupId
}: ManageGroupsDialogProps) {
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddGroup = () => {
    if (newGroupTitle.trim()) {
      addGroup(newGroupTitle.trim());
      setNewGroupTitle('');
    }
  };
  
  const handleStartEdit = (group: BookmarkGroup) => {
    setEditingGroupId(group.id);
    setEditingTitle(group.title);
  }

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingTitle('');
  }

  const handleSaveEdit = () => {
    if (editingGroupId && editingTitle.trim()) {
        updateGroup(editingGroupId, editingTitle.trim());
        handleCancelEdit();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Bookmark Groups</DialogTitle>
          <DialogDescription>
            Create, rename, or delete your bookmark groups.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex gap-2">
            <Input
              value={newGroupTitle}
              onChange={(e) => setNewGroupTitle(e.target.value)}
              placeholder="New group name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
            />
            <Button onClick={handleAddGroup} disabled={!newGroupTitle.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {groups.filter(g => g.id !== uncategorizedGroupId).map((group) => (
              <div key={group.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                {editingGroupId === group.id ? (
                  <>
                    <Input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={handleSaveEdit}><Save className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{group.title}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleStartEdit(group)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="hover:bg-destructive/20 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Deleting the "{group.title}" group will move all its bookmarks to "Uncategorized". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteGroup(group.id)}>Delete Group</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
