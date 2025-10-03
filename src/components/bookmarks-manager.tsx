'use client';

import React, { useState } from 'react';
import type { Bookmark } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import { Trash2, Edit, BookOpen } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from './ui/sidebar';
import AddBookmarkDialog from './add-bookmark-dialog';
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
  updateBookmark: (id: string, updatedBookmark: Partial<Omit<Bookmark, 'id'>>) => void;
  deleteBookmark: (id: string) => void;
}

export default function BookmarksManager({ bookmarks, updateBookmark, deleteBookmark }: BookmarksManagerProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleUpdate = (title: string, note: string) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, { title, note });
      setEditingBookmark(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            <h2 className="font-headline text-2xl font-bold">My Bookmarks</h2>
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
              {bookmarks.map(bookmark => (
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
          )}
        </ScrollArea>
      </SidebarContent>
      
      <AddBookmarkDialog
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={handleUpdate}
        existingBookmark={editingBookmark}
      />
    </div>
  );
}
