'use client';

import React from 'react';
import {SidebarProvider, Sidebar, SidebarInset} from '@/components/ui/sidebar';
import Header from '@/components/header';
import BookmarksManager from '@/components/bookmarks-manager';
import {useBookmarks} from '@/hooks/use-bookmarks';
import { videos } from '@/lib/placeholder-videos';
import VideoCard from '@/components/video-card';

export default function VideosPage() {
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" side="right" collapsible="icon">
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
            <div className="mb-8">
                <h1 className="font-headline text-3xl font-bold">Faith-Based Videos</h1>
                <p className="text-muted-foreground mt-2">Explore a collection of sermons, teachings, and worship sessions.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
