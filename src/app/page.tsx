'use client';

import React from 'react';
import {SidebarProvider, Sidebar, SidebarInset} from '@/components/ui/sidebar';
import Header from '@/components/header';
import HeroVerse from '@/components/hero-verse';
import BibleReader from '@/components/bible-reader';
import BookmarksManager from '@/components/bookmarks-manager';
import {useBookmarks} from '@/hooks/use-bookmarks';
import AddBookmarkDialog from '@/components/add-bookmark-dialog';
import type {Verse, Bookmark, BookmarkGroup} from '@/lib/types';
import { getHeroVerse } from '@/ai/flows/rotating-hero-verses';

export default function Home() {
  const {
    bookmarks,
    groups,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    exportBookmark,
    importBookmarks,
    exportBookmarks,
    addGroup,
    updateGroup,
    deleteGroup,
    UNCATEGORIZED_GROUP_ID,
    heroGroupId,
    setHeroGroup,
    exportGroup,
  } = useBookmarks();
  const [verseToBookmark, setVerseToBookmark] = React.useState<{version: string; book: string; chapter: number; verse: Verse} | null>(null);

  const handleBookmarkVerse = (version: string, book: string, chapter: number, verse: Verse) => {
    setVerseToBookmark({version, book, chapter, verse});
  };

  const handleSaveBookmark = (title: string, note: string, groupId: string | null) => {
    if (verseToBookmark) {
      const newBookmark: Omit<Bookmark, 'id' | 'createdAt' | 'isImported'> = {
        title,
        bibleVersion: verseToBookmark.version,
        book: verseToBookmark.book,
        chapter: verseToBookmark.chapter,
        verse: verseToBookmark.verse.verse,
        text: verseToBookmark.verse.text,
        note,
        groupId,
      };
      addBookmark(newBookmark);
      setVerseToBookmark(null);
    }
  };
  
  const heroVerses = React.useMemo(() => {
    if (heroGroupId) {
        return bookmarks
            .filter(b => b.groupId === heroGroupId)
            .map(b => ({ book: b.book, chapter: b.chapter, verse: b.verse, text: b.text }));
    }
    return null;
  }, [heroGroupId, bookmarks]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" side="right" className="dark:bg-background bg-sidebar" collapsible="icon">
           <BookmarksManager 
             bookmarks={bookmarks}
             groups={groups}
             updateBookmark={updateBookmark} 
             deleteBookmark={deleteBookmark}
             exportBookmark={exportBookmark}
             addGroup={addGroup}
             updateGroup={updateGroup}
             deleteGroup={deleteGroup}
             uncategorizedGroupId={UNCATEGORIZED_GROUP_ID}
             heroGroupId={heroGroupId}
             setHeroGroup={setHeroGroup}
             exportGroup={exportGroup}
            />
        </Sidebar>
        <SidebarInset className="bg-background flex flex-col">
          <Header importBookmarks={importBookmarks} exportBookmarks={exportBookmarks} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <HeroVerse 
                customVerses={heroVerses} 
                defaultVerseFetcher={() => getHeroVerse({ bibleVersion: 'KJV' })}
                onShowDefault={() => setHeroGroup(null)}
            />
            <BibleReader onBookmarkVerse={handleBookmarkVerse} bookmarks={bookmarks} />
          </main>
        </SidebarInset>
      </div>
      <AddBookmarkDialog
        isOpen={!!verseToBookmark}
        onClose={() => setVerseToBookmark(null)}
        verseData={verseToBookmark}
        onSave={handleSaveBookmark}
        groups={groups}
        uncategorizedGroupId={UNCATEGORIZED_GROUP_ID}
      />
    </SidebarProvider>
  );
}
