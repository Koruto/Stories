import { useState } from "react";
import Stories from "./Stories";
import Posts from "./Posts";
import StoryViewer from "./StoryViewer";
import data from "./data.json";
import type { Story } from "./types";

const sortStories = (stories: Story[]): Story[] => {
  return [...stories].sort((a, b) => {
    const aViewed = a.isViewed ?? false;
    const bViewed = b.isViewed ?? false;
    if (aViewed === bViewed) return 0;
    return aViewed ? 1 : -1;
  });
};

function App() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>(() =>
    sortStories(
      data.dummyStories.map((story) => ({ ...story, isViewed: false }))
    )
  );

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewerOpen(true);

    setStories((prev) =>
      prev.map((story, i) =>
        i === index ? { ...story, isViewed: true } : story
      )
    );
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setStories((prev) => sortStories(prev));
  };

  const handleStoryViewed = (storyId: number) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, isViewed: true } : story
      )
    );
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full h-full sm:w-96 sm:h-[600px] sm:max-h-[600px] relative overflow-hidden">
        <div className="w-full h-full bg-gray-500 sm:rounded-xl flex flex-col overflow-hidden">
          <div className="shrink-0">
            <Stories onStoryClick={handleStoryClick} stories={stories} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Posts />
          </div>
        </div>
        {isViewerOpen && (
          <StoryViewer
            stories={stories}
            initialStoryIndex={selectedStoryIndex}
            onClose={handleCloseViewer}
            onStoryViewed={handleStoryViewed}
          />
        )}
      </div>
    </div>
  );
}

export default App;
