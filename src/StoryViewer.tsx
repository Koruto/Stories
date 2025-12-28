import { useState, useEffect, useRef } from "react";
import type { Story } from "./types";
import { X } from "lucide-react";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryViewed: (storyId: number) => void;
}

export default function StoryViewer({
  stories,
  initialStoryIndex,
  onClose,
  onStoryViewed,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const frameIdRef = useRef<number>(0);

  const currentStory = stories[currentStoryIndex];
  const currentImage = currentStory.images[currentImageIndex];

  useEffect(() => {
    onStoryViewed(currentStory.id);
  }, [currentStoryIndex, currentStory.id, onStoryViewed]);

  useEffect(() => {
    const duration = 5000;
    startTimeRef.current = Date.now();
    setProgress(0);

    const animationFrame = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (elapsed >= duration) {
        if (currentImageIndex < currentStory.images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        } else if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex(currentStoryIndex + 1);
          setCurrentImageIndex(0);
        } else {
          onClose();
        }
      } else {
        frameIdRef.current = requestAnimationFrame(animationFrame);
      }
    };

    frameIdRef.current = requestAnimationFrame(animationFrame);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [
    currentStoryIndex,
    currentImageIndex,
    currentStory.images.length,
    stories.length,
    onClose,
  ]);

  const handlePrevious = () => {
    setProgress(0);
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentStoryIndex > 0) {
      const prevStoryIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevStoryIndex);
      setCurrentImageIndex(stories[prevStoryIndex].images.length - 1);
    }
  };

  const handleNext = () => {
    setProgress(0);
    if (currentImageIndex < currentStory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentImageIndex(0);
    } else {
      onClose();
    }
  };

  const getProgressWidth = (index: number) => {
    if (index < currentImageIndex) return "100%";
    if (index === currentImageIndex) return `${progress}%`;
    return "0%";
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 p-2 z-10">
        <div className="flex gap-1 mb-2 min-h-[4px]">
          {currentStory.images.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: getProgressWidth(index),
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 px-2">
          <img
            src={currentStory.avatar}
            alt={currentStory.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="text-white font-semibold">
            {currentStory.username}
          </span>
          <button onClick={onClose} className="ml-auto text-2xl font-bold">
            <X className="w-5 h-5 text-gray-200 hover:text-white" />
          </button>
        </div>
      </div>

      <img
        key={`${currentStoryIndex}-${currentImageIndex}`}
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
