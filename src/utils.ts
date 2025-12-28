import type { Story } from "./types";

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

export const preloadStory = async (story: Story): Promise<void> => {
  const images = [story.avatar, ...story.images];
  return Promise.all(images.map((url) => preloadImage(url)))
    .then(() => { })
    .catch(() => { });
};

