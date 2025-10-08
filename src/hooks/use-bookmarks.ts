'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Bookmark, BookmarkGroup } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const BOOKMARKS_STORAGE_KEY = 'verseMarkBookmarks';
const GROUPS_STORAGE_KEY = 'verseMarkGroups';
const UNCATEGORIZED_GROUP_ID = 'uncategorized';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
      const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        // Create default group if none exist
        const defaultGroup: BookmarkGroup = { id: UNCATEGORIZED_GROUP_ID, title: 'Uncategorized', createdAt: new Date().toISOString() };
        setGroups([defaultGroup]);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      toast({
        title: "Error",
        description: "Could not load your data.",
        variant: "destructive",
      });
    }
    setIsInitialized(true);
  }, [toast]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
         toast({
          title: "Error",
          description: "Could not save your data.",
          variant: "destructive",
        });
      }
    }
  }, [bookmarks, groups, isInitialized, toast]);

  const addBookmark = useCallback((newBookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setBookmarks(prev => [bookmark, ...prev]);
    toast({
        title: "Bookmark Added",
        description: `"${newBookmark.title}" has been saved.`,
    });
  }, [toast]);

  const updateBookmark = useCallback((id: string, updatedBookmark: Partial<Omit<Bookmark, 'id'>>) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, ...updatedBookmark } : b));
    toast({
        title: "Bookmark Updated",
        description: "Your bookmark has been successfully updated.",
    });
  }, [toast]);

  const deleteBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
     toast({
        title: "Bookmark Deleted",
        description: "The bookmark has been removed.",
        variant: "destructive",
    });
  }, [toast]);

  const addGroup = useCallback((title: string) => {
    if (groups.some(g => g.title.toLowerCase() === title.toLowerCase())) {
        toast({ title: 'Group exists', description: 'A group with this name already exists.', variant: 'destructive' });
        return;
    }
    const newGroup: BookmarkGroup = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => [...prev, newGroup]);
    toast({ title: 'Group Created', description: `Group "${title}" has been created.` });
  }, [groups, toast]);

  const updateGroup = useCallback((id: string, title: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, title } : g));
    toast({ title: 'Group Updated', description: 'Group has been renamed.' });
  }, [toast]);

  const deleteGroup = useCallback((id: string) => {
    setBookmarks(prev => prev.map(b => b.groupId === id ? { ...b, groupId: UNCATEGORIZED_GROUP_ID } : b));
    setGroups(prev => prev.filter(g => g.id !== id));
    toast({ title: 'Group Deleted', description: 'Group has been deleted and its bookmarks moved to Uncategorized.', variant: 'destructive' });
  }, [toast]);


  const exportBookmarks = useCallback(() => {
    if (bookmarks.length === 0) {
      toast({
        title: "No Bookmarks to Export",
        description: "You don't have any bookmarks to export.",
        variant: "destructive"
      });
      return;
    }
    try {
      const data = JSON.stringify({ bookmarks, groups }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verse-mark-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your bookmarks and groups have been exported.",
      });
    } catch (error) {
      console.error('Failed to export data', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  }, [bookmarks, groups, toast]);

  const importBookmarks = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not a string');
        }
        const importedData = JSON.parse(text);
        const importedBookmarks = importedData.bookmarks as Bookmark[] || [];
        const importedGroups = importedData.groups as BookmarkGroup[] || [];

        if (!Array.isArray(importedBookmarks) || (importedBookmarks.length > 0 && !importedBookmarks.every(b => b.book && b.chapter && b.verse))) {
            throw new Error("Invalid bookmark file format.");
        }
        if (!Array.isArray(importedGroups)) {
            throw new Error("Invalid group data in file.");
        }

        setGroups(prevGroups => {
            const existingGroupIds = new Set(prevGroups.map(g => g.id));
            const newGroups = importedGroups.filter(g => !existingGroupIds.has(g.id));
            return [...prevGroups, ...newGroups];
        });
        
        setBookmarks(prevBookmarks => {
          const existingKeys = new Set(prevBookmarks.map(b => `${b.book}-${b.chapter}-${b.verse}`));
          const newBookmarks = importedBookmarks.filter(b => !existingKeys.has(`${b.book}-${b.chapter}-${b.verse}`));
          const bookmarksWithImportFlag = newBookmarks.map(b => ({ ...b, isImported: true, groupId: b.groupId || UNCATEGORIZED_GROUP_ID }));
          return [...bookmarksWithImportFlag, ...prevBookmarks];
        });
        toast({
            title: "Import Successful",
            description: `New bookmarks and groups have been added.`,
        });
      } catch (error) {
        console.error('Failed to import bookmarks', error);
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid data file.",
          variant: "destructive",
        });
      }
    };
    reader.onerror = () => {
       toast({
          title: "Error Reading File",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
    }
    reader.readAsText(file);
  }, [toast]);

  return { bookmarks, groups, addBookmark, updateBookmark, deleteBookmark, exportBookmarks, importBookmarks, addGroup, updateGroup, deleteGroup, UNCATEGORIZED_GROUP_ID };
}
