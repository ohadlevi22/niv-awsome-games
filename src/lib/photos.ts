export const PHOTOS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo${i + 1}.jpg`,
}));
