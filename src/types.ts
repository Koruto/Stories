export interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
}

export interface Story {
  id: number;
  username: string;
  avatar: string;
  images: string[];
  isViewed?: boolean;
}
