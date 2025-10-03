
import type { Bible } from '@/lib/types';
import { oldTestament } from './kjv-old-testament';
import { newTestament } from './kjv-new-testament';

export const kjv: Bible = [...oldTestament, ...newTestament];
