'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { bibles, BIBLE_VERSIONS } from '@/lib/bible';
import type { Verse, Bookmark, Chapter, BibleBook } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface BibleReaderProps {
  onBookmarkVerse: (version: string, book: string, chapter: number, verse: Verse) => void;
  bookmarks: Bookmark[];
}

const API_URL = 'https://bible-api.com';

export default function BibleReader({ onBookmarkVerse, bookmarks }: BibleReaderProps) {
  const [selectedVersion, setSelectedVersion] = useState(Object.keys(BIBLE_VERSIONS)[0]);
  const [selectedBook, setSelectedBook] = useState(bibles[selectedVersion][0].book);
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBible = bibles[selectedVersion];
  
  const books = useMemo(() => currentBible.map(book => book.book), [currentBible]);

  const chapters = useMemo(() => {
    const bookData = currentBible.find(book => book.book === selectedBook);
    return bookData ? Array.from({ length: bookData.chapterCount }, (_, i) => (i + 1).toString()) : [];
  }, [currentBible, selectedBook]);
  
  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/${selectedBook} ${selectedChapter}?translation=${selectedVersion.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chapter');
        }
        const data = await response.json();
        setVerses(data.verses);
      } catch (error) {
        console.error("Error fetching chapter:", error);
        setVerses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [selectedBook, selectedChapter, selectedVersion]);


  const bookmarkedVerseKeys = useMemo(() => 
    new Set(bookmarks.map(b => `${b.bibleVersion}-${b.book}-${b.chapter}-${b.verse}`))
  , [bookmarks]);

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    const newBible = bibles[version];
    const newBook = newBible[0].book;
    setSelectedBook(newBook);
    setSelectedChapter('1');
  };

  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter('1');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="font-headline text-3xl">Read The Bible</CardTitle>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Select value={selectedVersion} onValueChange={handleVersionChange}>
              <SelectTrigger><SelectValue placeholder="Version" /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIBLE_VERSIONS).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBook} onValueChange={handleBookChange}>
              <SelectTrigger><SelectValue placeholder="Book" /></SelectTrigger>
              <SelectContent>
                {books.map(book => <SelectItem key={book} value={book}>{book}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger><SelectValue placeholder="Chapter" /></SelectTrigger>
              <SelectContent>
                {chapters.map(ch => <SelectItem key={ch} value={ch}>{`Chapter ${ch}`}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-headline text-2xl font-bold">{selectedBook} {selectedChapter}</h3>
          {loading ? (
             <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          ) : (
            <div className="space-y-2 font-body text-lg leading-relaxed">
              {verses.map(verse => {
                const verseKey = `${selectedVersion}-${selectedBook}-${selectedChapter}-${verse.verse}`;
                const isBookmarked = bookmarkedVerseKeys.has(verseKey);
                return (
                  <div key={verse.verse} className="group flex items-start gap-4">
                    <sup className="w-8 text-primary">{verse.verse}</sup>
                    <p 
                      className={cn(
                        'flex-1 rounded-md p-2 transition-colors', 
                        isBookmarked ? 'bg-accent/30' : 'group-hover:bg-muted'
                      )}
                    >
                      {verse.text}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onBookmarkVerse(selectedVersion, selectedBook, parseInt(selectedChapter, 10), verse)}
                      aria-label={`Bookmark verse ${verse.verse}`}
                      disabled={isBookmarked}
                    >
                      <BookmarkIcon className={cn('h-5 w-5', isBookmarked ? 'text-primary fill-primary' : 'text-primary/50')} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
