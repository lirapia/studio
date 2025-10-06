export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  book: string;
  chapters: Chapter[];
}

export interface BibleBook {
  book: string;
  chapterCount: number;
}


export type Bible = BibleBook[];

export interface Bookmark {
  id: string;
  title: string;
  bibleVersion: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  note: string;
  createdAt: string;
  isImported?: boolean;
}
