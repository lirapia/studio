'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Bookmark } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const BOOKMARKS_STORAGE_KEY = 'verseMarkBookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage', error);
      toast({
        title: "Error",
        description: "Could not load your bookmarks.",
        variant: "destructive",
      });
    }
    setIsInitialized(true);
  }, [toast]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Failed to save bookmarks to localStorage', error);
         toast({
          title: "Error",
          description: "Could not save your bookmarks.",
          variant: "destructive",
        });
      }
    }
  }, [bookmarks, isInitialized, toast]);

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
      const data = JSON.stringify(bookmarks, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verse-mark-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your bookmarks have been exported.",
      });
    } catch (error) {
      console.error('Failed to export bookmarks', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your bookmarks.",
        variant: "destructive",
      });
    }
  }, [bookmarks, toast]);

  const importBookmarks = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not a string');
        }
        const imported = JSON.parse(text) as Bookmark[];
        if (!Array.isArray(imported) || !imported.every(b => b.book && b.chapter && b.verse)) {
            throw new Error("Invalid bookmark file format.");
        }
        
        setBookmarks(prev => {
          const existingKeys = new Set(prev.map(b => `${b.book}-${b.chapter}-${b.verse}`));
          const newBookmarks = imported.filter(b => !existingKeys.has(`${b.book}-${b.chapter}-${b.verse}`));
          const bookmarksWithImportFlag = newBookmarks.map(b => ({ ...b, isImported: true }));
          return [...bookmarksWithImportFlag, ...prev];
        });
        toast({
            title: "Import Successful",
            description: `${imported.length} bookmarks were found. New bookmarks have been added.`,
        });
      } catch (error) {
        console.error('Failed to import bookmarks', error);
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid bookmark file.",
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

  return { bookmarks, addBookmark, updateBookmark, deleteBookmark, exportBookmarks, importBookmarks };
}
