// Real-photograph registry for the "reality" scenes (10–12).
//
// All photo paths live in one place so real images can be swapped in later
// without touching any scene logic — replace the files under
// public/images/ants/ (keeping the filenames), or repoint a key here.

export const ANT_IMAGES = {
  day1: '/images/ants/day-1.png',
  day3: '/images/ants/day-3.png',
  day5: '/images/ants/day-5.png',
  day10: '/images/ants/day-10.png',
  plasterCast: '/images/ants/final_.jpg',
} as const;
