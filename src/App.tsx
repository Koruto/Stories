import { useState } from "react";
import Stories from "./Stories";
import Posts from "./Posts";
import StoryViewer from "./StoryViewer";
import data from "./data.json";
import type { Story } from "./types";

function App() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const dummyStories: Story[] = data.dummyStories;

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="w-96 h-[600px] max-h-[600px] rounded-3xl relative overflow-hidden">
        <div className="w-full h-full bg-gray-500 rounded-3xl flex flex-col overflow-hidden">
          <div className="shrink-0">
            <Stories onStoryClick={handleStoryClick} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Posts />
          </div>
        </div>
        {isViewerOpen && (
          <StoryViewer
            stories={dummyStories}
            initialStoryIndex={selectedStoryIndex}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </div>
  );
}

export default App;
