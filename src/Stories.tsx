import data from "./data.json";
import type { Story } from "./types";

interface StoriesProps {
  onStoryClick: (index: number) => void;
}

export default function Stories({ onStoryClick }: StoriesProps) {
  const dummyStories: Story[] = data.dummyStories;

  return (
    <div className="w-full bg-red-500 overflow-x-auto">
      <div className="flex items-center gap-4 py-2 px-4 min-w-max">
        {dummyStories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center justify-center shrink-0 cursor-pointer group"
            onClick={() => onStoryClick(index)}
          >
            <img
              src={story.avatar}
              alt={story.username}
              className="w-16 h-16 rounded-full object-cover relative z-10 border-2 border-transparent transition-all duration-200 group-hover:border-white group-hover:scale-110"
            />
            <span className="text-xs mt-1">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
