'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getHeroVerse, type HeroVerseOutput } from '@/ai/flows/rotating-hero-verses';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroVerse() {
  const [verse, setVerse] = useState<HeroVerseOutput | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  const fetchVerse = useCallback(async () => {
    try {
      setLoading(true);
      const newVerse = await getHeroVerse({ bibleVersion: 'KJV' });
      setVerse(newVerse);
    } catch (error) {
      console.error('Error fetching hero verse:', error);
      // Fallback verse in case of API error
      setVerse({
        book: 'John',
        chapter: 3,
        verse: 16,
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerse();
    const interval = setInterval(fetchVerse, 60 * 60 * 1000); // every hour
    return () => clearInterval(interval);
  }, [fetchVerse]);

  return (
    <Card className="relative mb-8 w-full overflow-hidden border-primary/20 shadow-lg shadow-primary/10">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <CardContent className="relative z-10 flex min-h-[200px] flex-col items-center justify-center p-6 text-center text-foreground">
        {loading ? (
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/4 mx-auto" />
          </div>
        ) : verse ? (
          <>
            <blockquote className="max-w-3xl">
              <p className="font-headline text-2xl md:text-3xl font-semibold leading-tight">
                “{verse.text}”
              </p>
            </blockquote>
            <cite className="mt-4 block font-body text-lg font-semibold text-primary not-italic">
              {verse.book} {verse.chapter}:{verse.verse}
            </cite>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
