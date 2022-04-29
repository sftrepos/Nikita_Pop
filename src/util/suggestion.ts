import Fuse from 'fuse.js';
import majors from '../constants/majors';

export const suggestMajors = (value: string, limit = 10): string[] => {
  const fuse = new Fuse(majors, { keys: ['title'] });
  const results = fuse.search(value, { limit });
  const arr = [] as string[];
  results.forEach((result) => {
    arr.push(result.item.title);
  });
  return arr;
};
