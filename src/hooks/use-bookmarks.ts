'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Bookmark, BookmarkGroup } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const BOOKMARKS_STORAGE_KEY = 'verseMarkBookmarks';
const GROUPS_STORAGE_KEY = 'verseMarkGroups';
const HERO_GROUP_ID_STORAGE_KEY = 'verseMarkHeroGroupId';
const UNCATEGORIZED_GROUP_ID = 'uncategorized';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [heroGroupId, setHeroGroupIdState] = useState<string | null>(null);
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
      const storedHeroGroupId = localStorage.getItem(HERO_GROUP_ID_STORAGE_KEY);
      if (storedHeroGroupId) {
        setHeroGroupIdState(JSON.parse(storedHeroGroupId));
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
        if (heroGroupId) {
          localStorage.setItem(HERO_GROUP_ID_STORAGE_KEY, JSON.stringify(heroGroupId));
        } else {
          localStorage.removeItem(HERO_GROUP_ID_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
         toast({
          title: "Error",
          description: "Could not save your data.",
          variant: "destructive",
        });
      }
    }
  }, [bookmarks, groups, heroGroupId, isInitialized, toast]);

  const addBookmark = useCallback((newBookmark: Omit<Bookmark, 'id' | 'createdAt' | 'isImported'>) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isImported: false,
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
    if(heroGroupId === id) {
        setHeroGroupIdState(null);
    }
    setBookmarks(prev => prev.map(b => b.groupId === id ? { ...b, groupId: UNCATEGORIZED_GROUP_ID } : b));
    setGroups(prev => prev.filter(g => g.id !== id));
    toast({ title: 'Group Deleted', description: 'Group has been deleted and its bookmarks moved to Uncategorized.', variant: 'destructive' });
  }, [heroGroupId, toast]);

  const setHeroGroup = useCallback((groupId: string | null) => {
      setHeroGroupIdState(groupId);
      if (groupId) {
        const group = groups.find(g => g.id === groupId);
        toast({
            title: "Hero Section Updated",
            description: `Now showing verses from "${group?.title}".`,
        });
      } else {
         toast({
            title: "Hero Section Updated",
            description: `Now showing default verses.`,
        });
      }
  },[groups, toast]);

  const exportData = useCallback((dataToExport: object, fileName: string) => {
    try {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export data', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
      return false;
    }
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
    const success = exportData({ bookmarks, groups }, `verse-mark-data-${new Date().toISOString().split('T')[0]}.json`);
    if(success) {
      toast({
        title: "Export Successful",
        description: "Your bookmarks and groups have been exported.",
      });
    }
  }, [bookmarks, groups, toast, exportData]);

    const exportBookmark = useCallback((bookmarkId: string) => {
        const bookmark = bookmarks.find(b => b.id === bookmarkId);
        if (!bookmark) {
            toast({
                title: "Bookmark Not Found",
                variant: "destructive"
            });
            return;
        }
        const success = exportData(bookmark, `verse-mark-bookmark-${bookmark.title.toLowerCase().replace(/\s/g, '-')}.json`);
        if (success) {
            toast({
                title: "Bookmark Exported",
                description: `The bookmark "${bookmark.title}" has been exported.`,
            });
        }
    }, [bookmarks, toast, exportData]);
  
  const exportGroup = useCallback((groupId: string) => {
      const group = groups.find(g => g.id === groupId);
      if(!group) return;

      const isUncategorized = groupId === UNCATEGORIZED_GROUP_ID;

      const groupBookmarks = bookmarks.filter(b => isUncategorized ? (b.groupId === null || b.groupId === UNCATEGORIZED_GROUP_ID) : (b.groupId === groupId));

      if (groupBookmarks.length === 0) {
          toast({
              title: "No Bookmarks in Group",
              description: `The group "${group.title}" has no bookmarks to export.`,
              variant: "destructive"
          });
          return;
      }

      const exportObject = {
        bookmarks: groupBookmarks,
        groups: isUncategorized ? [group] : groups
      }
      
      const success = exportData(exportObject, `verse-mark-group-${group.title.toLowerCase().replace(/\s/g, '-')}.json`);

      if(success) {
          toast({
              title: "Group Exported",
              description: `The group "${group.title}" has been exported.`,
          });
      }
  }, [bookmarks, groups, toast, exportData, UNCATEGORIZED_GROUP_ID]);


  const importBookmarks = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not a string');
        }
        const importedData = JSON.parse(text);
        
        let importedBookmarks: Bookmark[];

        // Handle both single bookmark and multi-bookmark/group export formats
        if (Array.isArray(importedData.bookmarks)) {
           importedBookmarks = importedData.bookmarks as Bookmark[] || [];
        } else if (importedData.book && importedData.chapter && importedData.verse) {
           importedBookmarks = [importedData as Bookmark];
        } else {
            throw new Error("Invalid bookmark file format.");
        }
       
        const importedGroups = importedData.groups as BookmarkGroup[] || [];

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
          const bookmarksWithImportFlag = newBookmarks.map(b => ({ ...b, isImported: true, id: b.id || crypto.randomUUID(), groupId: b.groupId || UNCATEGORIZED_GROUP_ID }));
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

  return { bookmarks, groups, addBookmark, updateBookmark, deleteBookmark, exportBookmark, exportBookmarks, importBookmarks, addGroup, updateGroup, deleteGroup, UNCATEGORIZED_GROUP_ID, heroGroupId, setHeroGroup, exportGroup };
}
