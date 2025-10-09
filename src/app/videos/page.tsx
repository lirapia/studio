'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/header';
import BookmarksManager from '@/components/bookmarks-manager';
import { useBookmarks } from '@/hooks/use-bookmarks';
import type { Video } from '@/lib/types';
import VideoCard from '@/components/video-card';
import { searchYoutubeVideos } from '@/ai/flows/search-videos-flow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

export default function VideosPage() {
  const {
    bookmarks,
    groups,
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [query, setQuery] = useState('Faith');
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (searchQuery: string) => {
    startTransition(async () => {
      const results = await searchYoutubeVideos({ query: searchQuery });
      setVideos(results);
    });
  };
  
  useEffect(() => {
    handleSearch(query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
  };


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
                <p className="text-muted-foreground mt-2">Explore sermons, teachings, and worship about God's word and love.</p>
            </div>
            <form onSubmit={onSearch} className="flex w-full max-w-lg items-center space-x-2 mb-8">
                <Input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for videos (e.g. Faith, God's Love)"
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                </Button>
            </form>
            
            {isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                           <div className="aspect-video bg-muted rounded-md animate-pulse"></div>
                           <div className="h-4 bg-muted rounded-md animate-pulse w-3/4"></div>
                           <div className="h-4 bg-muted rounded-md animate-pulse w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
            
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
