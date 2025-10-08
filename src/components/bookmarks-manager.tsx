'use client';

import React, { useState, useMemo } from 'react';
import type { Bookmark, BookmarkGroup } from '@/lib/types';
import {
  Card,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, BookOpen, Plus, Settings } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from './ui/sidebar';
import AddBookmarkDialog from './add-bookmark-dialog';
import { ManageGroupsDialog } from './manage-groups-dialog';
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

interface BookmarksManagerProps {
  bookmarks: Bookmark[];
  groups: BookmarkGroup[];
  updateBookmark: (id: string, updatedBookmark: Partial<Omit<Bookmark, 'id'>>) => void;
  deleteBookmark: (id: string) => void;
  addGroup: (title: string) => void;
  updateGroup: (id: string, title: string) => void;
  deleteGroup: (id: string) => void;
  uncategorizedGroupId: string;
}

export default function BookmarksManager({
  bookmarks,
  groups,
  updateBookmark,
  deleteBookmark,
  addGroup,
  updateGroup,
  deleteGroup,
  uncategorizedGroupId
}: BookmarksManagerProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isGroupsDialogOpen, setGroupsDialogOpen] = useState(false);

  const handleUpdate = (title: string, note: string, groupId: string | null) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, { title, note, groupId });
      setEditingBookmark(null);
    }
  };

  const groupedBookmarks = useMemo(() => {
    const groupMap = new Map<string, Bookmark[]>();
    
    // Ensure all groups exist in the map, even if empty
    groups.forEach(group => groupMap.set(group.id, []));

    // Handle uncategorized bookmarks
    if (!groupMap.has(uncategorizedGroupId)) {
        const uncategorizedGroup = groups.find(g => g.id === uncategorizedGroupId);
        if (uncategorizedGroup) {
             groupMap.set(uncategorizedGroupId, []);
        }
    } else {
         const uncategorizedBookmarks = bookmarks.filter(b => b.groupId === null || b.groupId === uncategorizedGroupId);
         groupMap.set(uncategorizedGroupId, uncategorizedBookmarks);
    }

    bookmarks.forEach(bookmark => {
      const groupId = bookmark.groupId ?? uncategorizedGroupId;
      if (!groupMap.has(groupId)) {
          // This case handles bookmarks with a groupId that no longer exists.
          // They are added to uncategorized.
          const currentUncategorized = groupMap.get(uncategorizedGroupId) || [];
          groupMap.set(uncategorizedGroupId, [...currentUncategorized, bookmark]);
      } else {
        const currentGroupBookmarks = groupMap.get(groupId) || [];
        groupMap.set(groupId, [...currentGroupBookmarks, bookmark]);
      }
    });

    return Array.from(groupMap.entries())
        .map(([groupId, bookmarks]) => ({
            group: groups.find(g => g.id === groupId),
            bookmarks
        }))
        .filter(item => item.group) // Filter out potential orphaned groups
        .sort((a, b) => {
            if (a.group!.id === uncategorizedGroupId) return 1; // Uncategorized always last
            if (b.group!.id === uncategorizedGroupId) return -1;
            return a.group!.title.localeCompare(b.group!.title);
        });

  }, [bookmarks, groups, uncategorizedGroupId]);


  return (
    <div className="flex flex-col h-full w-full">
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BookOpen className="size-6 text-primary" />
                <h2 className="font-headline text-2xl font-bold">My Bookmarks</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setGroupsDialogOpen(true)}>
                <Settings className="size-5" />
            </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          {bookmarks.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-sidebar-foreground/60">
              <p>Your bookmarked verses will appear here. Highlight a verse to save it.</p>
            </div>
          ) : (
             <Accordion type="multiple" className="w-full p-4">
               {groupedBookmarks.map(({ group, bookmarks: groupBookmarks }) => (
                 group && groupBookmarks.length > 0 && (
                   <AccordionItem key={group.id} value={group.id} className="border-none mb-2">
                      <Card className="bg-sidebar-accent/30">
                        <AccordionTrigger className="p-4 hover:no-underline">
                           <div className="flex justify-between w-full items-center">
                              <h3 className="font-headline text-lg font-bold text-sidebar-foreground">{group.title}</h3>
                              <Badge variant="secondary">{groupBookmarks.length}</Badge>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                           <Accordion type="multiple" className="w-full">
                            {groupBookmarks.map(bookmark => (
                                <AccordionItem key={bookmark.id} value={bookmark.id}>
                                <Card className="mb-2 border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground">
                                    <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
                                        <div className="flex-1 text-left">
                                            <CardTitle className="text-base font-headline font-bold">{bookmark.title}</CardTitle>
                                            <CardDescription className="text-xs text-sidebar-foreground/80">
                                                {bookmark.book} {bookmark.chapter}:{bookmark.verse} ({bookmark.bibleVersion})
                                            </CardDescription>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                    <p className="mb-4 text-sm italic">"{bookmark.text}"</p>
                                    {bookmark.note && <p className="mb-4 text-sm rounded-md border border-sidebar-border bg-sidebar p-2">{bookmark.note}</p>}
                                    <div className="flex items-center justify-between">
                                        <div className='flex gap-2'>
                                        {bookmark.isImported && <Badge variant="outline">Imported</Badge>}
                                        <Badge variant="secondary">{new Date(bookmark.createdAt).toLocaleDateString()}</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingBookmark(bookmark)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your bookmark titled "{bookmark.title}".
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteBookmark(bookmark.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    </AccordionContent>
                                </Card>
                                </AccordionItem>
                            ))}
                            </Accordion>
                        </AccordionContent>
                      </Card>
                   </AccordionItem>
                 )
               ))}
             </Accordion>
          )}
        </ScrollArea>
      </SidebarContent>
      
      <AddBookmarkDialog
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={handleUpdate}
        existingBookmark={editingBookmark}
        groups={groups}
        uncategorizedGroupId={uncategorizedGroupId}
      />
      <ManageGroupsDialog
        isOpen={isGroupsDialogOpen}
        onClose={() => setGroupsDialogOpen(false)}
        groups={groups}
        addGroup={addGroup}
        updateGroup={updateGroup}
        deleteGroup={deleteGroup}
        uncategorizedGroupId={uncategorizedGroupId}
      />
    </div>
  );
}
