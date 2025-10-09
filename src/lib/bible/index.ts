import type { Bible } from '@/lib/types';
import { kjv } from './kjv';
import { nkjv } from './nkjv';

export const BIBLE_VERSIONS = {
  KJV: 'King James Version',
  NKJV: 'New King James Version',
};

export const bibles: { [key: string]: Bible } = {
  KJV: kjv,
  NKJV: nkjv,
};
