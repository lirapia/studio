'use client';

import React from 'react';
import {SidebarProvider, Sidebar, SidebarInset} from '@/components/ui/sidebar';
import Header from '@/components/header';
import HeroVerse from '@/components/hero-verse';
import BibleReader from '@/components/bible-reader';
import BookmarksManager from '@/components/bookmarks-manager';
import {useBookmarks} from '@/hooks/use-bookmarks';
import AddBookmarkDialog from '@/components/add-bookmark-dialog';
import type {Verse, Bookmark} from '@/lib/types';

export default function Home() {
  const {bookmarks, addBookmark, updateBookmark, deleteBookmark, importBookmarks, exportBookmarks} = useBookmarks();
  const [verseToBookmark, setVerseToBookmark] = React.useState<{version: string; book: string; chapter: number; verse: Verse} | null>(null);

  const handleBookmarkVerse = (version: string, book: string, chapter: number, verse: Verse) => {
    setVerseToBookmark({version, book, chapter, verse});
  };

  const handleSaveBookmark = (title: string, note: string) => {
    if (verseToBookmark) {
      const newBookmark: Omit<Bookmark, 'id' | 'createdAt' | 'isImported'> = {
        title,
        bibleVersion: verseToBookmark.version,
        book: verseToBookmark.book,
        chapter: verseToBookmark.chapter,
        verse: verseToBookmark.verse.verse,
        text: verseToBookmark.verse.text,
        note,
      };
      addBookmark(newBookmark);
      setVerseToBookmark(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" side="right" className="dark:bg-background bg-sidebar" collapsible="icon">
           <BookmarksManager bookmarks={bookmarks} updateBookmark={updateBookmark} deleteBookmark={deleteBookmark} />
        </Sidebar>
        <SidebarInset className="bg-background flex flex-col">
          <Header importBookmarks={importBookmarks} exportBookmarks={exportBookmarks} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <HeroVerse />
            <BibleReader onBookmarkVerse={handleBookmarkVerse} bookmarks={bookmarks} />
          </main>
        </SidebarInset>
      </div>
      <AddBookmarkDialog
        isOpen={!!verseToBookmark}
        onClose={() => setVerseToBookmark(null)}
        verseData={verseToBookmark}
        onSave={handleSaveBookmark}
      />
    </SidebarProvider>
  );
}
