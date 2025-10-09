'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching YouTube videos.
 * It's set up to be easily integrated with the YouTube Data API.
 * For now, it returns placeholder data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Video } from '@/lib/types';

const SearchVideosInputSchema = z.object({
  query: z.string().describe('The search query for YouTube videos.'),
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
});

const SearchVideosOutputSchema = z.array(VideoSchema);
export type SearchVideosOutput = z.infer<typeof SearchVideosOutputSchema>;


// This function is what your client-side code will call.
export async function searchYoutubeVideos(input: SearchVideosInput): Promise<SearchVideosOutput> {
  // We are directly calling the flow here.
  // In a production app, you might add more logic here, like caching.
  return searchVideosFlow(input);
}


const searchVideosFlow = ai.defineFlow(
  {
    name: 'searchVideosFlow',
    inputSchema: SearchVideosInputSchema,
    outputSchema: SearchVideosOutputSchema,
  },
  async (input) => {
    //
    // TODO: Implement YouTube Data API call here.
    //
    // 1. You will need a YouTube Data API key.
    // 2. You can use `node-fetch` or `axios` to make a request to the YouTube API.
    //    Example endpoint: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${input.query}&type=video&key=YOUR_API_KEY`
    // 3. You'll also need to fetch channel details to get the channel image.
    // 4. Format the response to match the 'Video' type from '@/lib/types'.
    //
    
    console.log(`Searching for videos with query: ${input.query}`);

    // Returning hardcoded placeholder data for now.
    // This mimics the structure of what the YouTube API would return.
    const placeholderVideos: Video[] = [
      {
        id: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
        title: 'The Surprising Power of Gratitude in Faith',
        channel: 'FaithFuel',
        views: '1.2M views',
        uploadedAt: '2 weeks ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid1/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan1/48/48',
      },
      {
        id: 'L_LUpnjgPso', // Official "Charlie Bit My Finger"
        title: 'Finding Peace in a Chaotic World: A Sermon',
        channel: 'The Digital Pulpit',
        views: '890K views',
        uploadedAt: '1 month ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid2/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan2/48/48',
      },
      {
        id: 'kfVsfOSbJY0', // Nyan Cat
        title: 'Historical Context of the Book of Romans',
        channel: 'Bible Scholars United',
        views: '450K views',
        uploadedAt: '3 weeks ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid3/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan3/48/48',
      },
      {
        id: 'jNQXAC9IVRw', // me at the zoo
        title: 'Daily Devotional: Strength in Times of Trouble',
        channel: 'Morning Manna',
        views: '2.1M views',
        uploadedAt: '1 day ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid4/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan4/48/48',
      },
      {
        id: 'ZZ5LpwO-An4', // Keyboard Cat
        title: 'How to Read the Bible for Beginners',
        channel: 'The Good Word',
        views: '3.5M views',
        uploadedAt: '6 months ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid5/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan5/48/48',
      },
      {
        id: 'QH2-TGUlwu4', // Numa Numa
        title: 'Parables of Jesus Explained: The Good Samaritan',
        channel: 'Faith Visualized',
        views: '980K views',
        uploadedAt: '2 months ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid6/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan6/48/48',
      },
      {
        id: 'Kxa_p_t5gGM',// Leave Britney Alone
        title: 'Worship Session: Hymns of Praise',
        channel: 'Eternal Song',
        views: '750K views',
        uploadedAt: '3 days ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid7/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan7/48/48',
      },
      {
        id: 'o-YBDTqX_ZU', // Chocolate Rain
        title: 'The Life of David: A Shepherd King',
        channel: 'Bible Stories Animated',
        views: '4.2M views',
        uploadedAt: '1 year ago',
        thumbnailUrl: 'https://picsum.photos/seed/vid8/640/360',
        channelImageUrl: 'https://picsum.photos/seed/chan8/48/48',
      },
    ];

    // Filter placeholder videos based on query for demonstration purposes
    return placeholderVideos.filter(v => 
        v.title.toLowerCase().includes(input.query.toLowerCase()) || 
        v.channel.toLowerCase().includes(input.query.toLowerCase())
    ).slice(0, 8);
  }
);
