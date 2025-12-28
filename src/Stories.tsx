import type { Story } from "./types";

interface StoriesProps {
  onStoryClick: (index: number) => void;
  stories: Story[];
}

export default function Stories({ onStoryClick, stories }: StoriesProps) {
  return (
    <div className="w-full bg-black overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4 py-2 px-4 min-w-max">
        {stories.map((story, index) => {
          const isViewed = story.isViewed ?? false;

          return (
            <div
              key={story.id}
              className="flex flex-col items-center justify-center shrink-0 cursor-pointer group"
              onClick={() => onStoryClick(index)}
            >
              <div className="relative p-1 rounded-full">
                {!isViewed ? (
                  <div className="absolute inset-0 rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500"></div>
                ) : (
                  <div className="absolute inset-0 rounded-full bg-gray-400"></div>
                )}
                <div className="relative bg-black rounded-full p-1">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover transition-all duration-200 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="text-xs mt-1">{story.username}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
