
'use server';

/**
 * @fileOverview This file defines a Genkit flow to select and display a rotating Bible verse every hour,
 * focusing on themes of God's love, care, mercy, and grace. It exports the `getHeroVerse` function,
 * the `HeroVerseInput` type, and the `HeroVerseOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HeroVerseInputSchema = z.object({
  bibleVersion: z.string().describe('The version of the Bible to select verses from.'),
});
export type HeroVerseInput = z.infer<typeof HeroVerseInputSchema>;

const HeroVerseOutputSchema = z.object({
  book: z.string().describe('The book of the Bible the verse is from.'),
  chapter: z.number().describe('The chapter of the Bible the verse is from.'),
  verse: z.number().describe('The verse number.'),
  text: z.string().describe('The text of the Bible verse.'),
});
export type HeroVerseOutput = z.infer<typeof HeroVerseOutputSchema>;

export async function getHeroVerse(input: HeroVerseInput): Promise<HeroVerseOutput> {
  return heroVerseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'heroVersePrompt',
  input: {schema: HeroVerseInputSchema},
  output: {schema: HeroVerseOutputSchema},
  prompt: `You are a helpful assistant designed to select a Bible verse for the user. The verse should focus on themes of God's love, care, mercy, and grace.

  Select a verse from the {{{bibleVersion}}} version of the bible.
  Return the book, chapter, verse, and text of the verse.
  Ensure that the chosen verse aligns with the themes of God's love, care, mercy and grace.
  `,
});

const heroVerseFlow = ai.defineFlow(
  {
    name: 'heroVerseFlow',
    inputSchema: HeroVerseInputSchema,
    outputSchema: HeroVerseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
