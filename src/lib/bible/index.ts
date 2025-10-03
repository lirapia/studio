import type { Bible } from '@/lib/types';
import { kjv } from './kjv';
import { nkjv } from './nkjv';
import { emtv } from './emtv';

export const BIBLE_VERSIONS = {
  KJV: 'King James Version',
  NKJV: 'New King James Version',
  EMTV: 'English Majority Text Version',
};

export const bibles: { [key: string]: Bible } = {
  KJV: kjv,
  NKJV: nkjv,
  EMTV: emtv,
};
