import type { Comparison } from '@/data/mockData';
import comparisonsJson from '@/content/comparisons.json';

export const cmsComparisons = comparisonsJson as unknown as Comparison[];
