'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Video } from '@/lib/placeholder-videos';
import { BookOpen } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={video.videoUrl} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border">
               <AvatarImage src={video.channelImageUrl} alt={video.channel} />
               <AvatarFallback>
                <BookOpen/>
               </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-headline text-base font-bold leading-snug line-clamp-2">
                {video.title}
              </h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <p className="line-clamp-1">{video.channel}</p>
                <p>
                  {video.views} &bull; {video.uploadedAt}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
