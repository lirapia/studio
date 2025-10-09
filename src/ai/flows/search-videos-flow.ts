'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching videos.
 * It currently returns placeholder data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Video } from '@/lib/types';

const SearchVideosInputSchema = z.object({
  query: z.string().describe('The search query for videos.'),
});
export type SearchVideosInput = z.infer<typeof SearchVideosInputSchema>;

const VideoSchema = z.object({
    id: z.string(),
    title: z.string(),
    channel: z.string(),
    views: z.string(),
    uploadedAt: z.string(),
    thumbnailUrl: z.string(),
    channelImageUrl: z.string(),
    platform: z.enum(['youtube', 'vimeo']).optional(),
});

const SearchVideosOutputSchema = z.array(VideoSchema);
export type SearchVideosOutput = z.infer<typeof SearchVideosOutputSchema>;


// This function is what your client-side code will call.
export async function searchVideos(input: SearchVideosInput): Promise<SearchVideosOutput> {
  // We are directly calling the flow here.
  return searchVideosFlow(input);
}


const searchVideosFlow = ai.defineFlow(
  {
    name: 'searchVideosFlow',
    inputSchema: SearchVideosInputSchema,
    outputSchema: SearchVideosOutputSchema,
  },
  async (input) => {
    // This flow uses hardcoded placeholder data.
    // In a real application, you would replace this with a call to a video API.
    const placeholderVideos: Video[] = [
      {
        id: 'placeholder1',
        title: 'The Surprising Power of Gratitude in Faith',
        channel: 'FaithFuel',
        views: '1.2M views',
        uploadedAt: '2 weeks ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid1/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan1/48/48',
        platform: 'youtube',
      },
      {
        id: 'placeholder2',
        title: 'Finding Peace in a Chaotic World: A Sermon on God\'s Love',
        channel: 'The Digital Pulpit',
        views: '890K views',
        uploadedAt: '1 month ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid2/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan2/48/48',
        platform: 'youtube',
      },
      {
        id: 'placeholder_vimeo_1',
        title: 'Understanding Mercy: A Deep Dive into Scripture',
        channel: 'Bible Scholars United',
        views: '450K views',
        uploadedAt: '3 weeks ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid3/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan3/48/48',
        platform: 'vimeo',
      },
      {
        id: 'placeholder4',
        title: 'Daily Devotional: Experiencing God\'s Care',
        channel: 'Morning Manna',
        views: '2.1M views',
        uploadedAt: '1 day ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid4/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan4/48/48',
        platform: 'youtube',
      },
      {
        id: 'placeholder5',
        title: 'How to Deepen Your Faith and Trust in God',
        channel: 'The Good Word',
        views: '3.5M views',
        uploadedAt: '6 months ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid5/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan5/48/48',
        platform: 'youtube',
      },
      {
        id: 'placeholder6',
        title: 'The Infinite Love and Mercy of God',
        channel: 'Faith Visualized',
        views: '980K views',
        uploadedAt: '2 months ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid6/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan6/48/48',
        platform: 'youtube',
      },
      {
        id: 'placeholder7',
        title: 'Worship Session: Songs of Love and Grace',
        channel: 'Eternal Song',
        views: '750K views',
        uploadedAt: '3 days ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid7/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan7/48/48',
        platform: 'youtube',
      },
      {
        id: 'o-YBDTqX_ZU', // A real, relevant video
        title: 'Sermon: He Cares for You - Trusting God in Hard Times',
        channel: 'Johnnychanglive',
        views: '4.2M views',
        uploadedAt: '1 year ago',
        thumbnailUrl: 'https://i.ytimg.com/vi/o-YBDTqX_ZU/hqdefault.jpg',
        channelImageUrl: 'https://picsum.photos/seed/chan8/48/48',
        platform: 'youtube',
      },
    ];

    // Filter placeholder videos based on query for demonstration purposes
    const searchTerm = input.query.toLowerCase();
    if (!searchTerm) {
        return placeholderVideos.slice(0, 8);
    }
    
    return placeholderVideos.filter(v => 
        v.title.toLowerCase().includes(searchTerm) || 
        v.channel.toLowerCase().includes(searchTerm)
    ).slice(0, 8);
  }
);
