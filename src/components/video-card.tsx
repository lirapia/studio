'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Video } from '@/lib/types';
import { BookOpen, Youtube, Video as VideoIcon } from 'lucide-react';
import { Button } from './ui/button';

interface VideoCardProps {
  video: Video;
}

const getPlatformDetails = (video: Video) => {
    switch (video.platform) {
        case 'vimeo':
            return {
                url: `https://vimeo.com/${video.id}`,
                icon: <VideoIcon className="mr-2" />,
                text: 'Watch on Vimeo',
            };
        case 'youtube':
        default:
            return {
                url: `https://www.youtube.com/watch?v=${video.id}`,
                icon: <Youtube className="mr-2" />,
                text: 'Watch on YouTube',
            };
    }
}

export default function VideoCard({ video }: VideoCardProps) {
  const { url, icon, text } = getPlatformDetails(video);

  return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col group">
        <div className="relative aspect-video">
          <Link href={url} target="_blank">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
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
              <Link href={url} target="_blank">
                <h3 className="font-headline text-base font-bold leading-snug line-clamp-2 hover:underline">
                  {video.title}
                </h3>
              </Link>
              <div className="mt-1 text-sm text-muted-foreground">
                <p className="line-clamp-1">{video.channel}</p>
                 <p>
                  {video.views} &bull; {video.uploadedAt}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
         <div className="px-4 pb-4">
          <Button asChild className="w-full">
            <Link href={url} target="_blank">
                {icon}
                {text}
            </Link>
          </Button>
        </div>
      </Card>
  );
}
