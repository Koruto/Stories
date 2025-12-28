import { useState } from "react";
import type { Story } from "./types";
import { X } from "lucide-react";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export default function StoryViewer({
  stories,
  initialStoryIndex,
  onClose,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const currentImage = currentStory.images[currentImageIndex];

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentImageIndex(stories[currentStoryIndex - 1].images.length - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < currentStory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentImageIndex(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center rounded-3xl">
      <div className="absolute top-0 left-0 right-0 p-2 z-10">
        <div className="flex items-center gap-3 px-2 ">
          <img
            src={currentStory.avatar}
            alt={currentStory.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span>{currentStory.username}</span>
          <button onClick={onClose} className="ml-auto text-2xl font-bold">
            <X className="w-5 h-5 text-gray-200 hover:text-white" />
          </button>
        </div>
      </div>

      <img
        src={currentImage}
        alt={`Story ${currentImageIndex + 1}`}
        className="w-full h-full object-contain"
      />

      <div className="absolute inset-0 flex">
        <div className="flex-1 cursor-pointer" onClick={handlePrevious}></div>
        <div className="flex-1 cursor-pointer" onClick={handleNext}></div>
      </div>
    </div>
  );
}
