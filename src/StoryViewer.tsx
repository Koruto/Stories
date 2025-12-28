import { useState, useEffect, useRef } from "react";
import type { Story } from "./types";
import { X } from "lucide-react";
import { preloadStory } from "./utils";

interface StoryViewerProps {
  stories: Story[];
  initialStoryId: number;
  onClose: () => void;
  onStoryViewed: (storyId: number) => void;
}

const STORY_DURATION = 5000;

export default function StoryViewer({
  stories,
  initialStoryId,
  onClose,
  onStoryViewed,
}: StoryViewerProps) {
  const [currentStoryId, setCurrentStoryId] = useState(initialStoryId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const frameIdRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const viewedStoryIdsRef = useRef<Set<number>>(new Set());

  const currentStory = stories.find((s) => s.id === currentStoryId);
  const currentIndex = stories.findIndex((s) => s.id === currentStoryId);
  const currentImage = currentStory?.images[currentImageIndex];

  if (!currentStory) return null;

  const markAsViewed = (storyId: number) => {
    if (viewedStoryIdsRef.current.has(storyId)) return;
    const story = stories.find((s) => s.id === storyId);
    if (story && !story.isViewed) {
      viewedStoryIdsRef.current.add(storyId);
      onStoryViewed(storyId);
    }
  };

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      const nextStory = stories[currentIndex + 1];
      setCurrentStoryId(nextStory.id);
      setCurrentImageIndex(0);
      markAsViewed(nextStory.id);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      const prevStory = stories[currentIndex - 1];
      setCurrentStoryId(prevStory.id);
      setCurrentImageIndex(prevStory.images.length - 1);
      markAsViewed(prevStory.id);
    }
  };

  const handleNext = () => {
    setProgress(0);
    if (currentImageIndex < currentStory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      goToNextStory();
    }
  };

  const handlePrevious = () => {
    setProgress(0);
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      goToPrevStory();
    }
  };

  useEffect(() => {
    setCurrentStoryId(initialStoryId);
    setCurrentImageIndex(0);
    viewedStoryIdsRef.current.clear();
  }, [initialStoryId]);

  useEffect(() => {
    const story = stories.find((s) => s.id === currentStoryId);
    if (
      story &&
      !story.isViewed &&
      !viewedStoryIdsRef.current.has(currentStoryId)
    ) {
      viewedStoryIdsRef.current.add(currentStoryId);
      onStoryViewed(currentStoryId);
    }
  }, [currentStoryId, stories, onStoryViewed]);

  useEffect(() => {
    const nextStories = stories.slice(currentIndex + 1, currentIndex + 3);
    nextStories.forEach(preloadStory);
  }, [currentStoryId, stories, currentIndex]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= STORY_DURATION) {
        const story = stories.find((s) => s.id === currentStoryId);
        if (!story) return;

        if (currentImageIndex < story.images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        } else {
          const idx = stories.findIndex((s) => s.id === currentStoryId);
          if (idx < stories.length - 1) {
            const nextStory = stories[idx + 1];
            setCurrentStoryId(nextStory.id);
            setCurrentImageIndex(0);
            if (
              !nextStory.isViewed &&
              !viewedStoryIdsRef.current.has(nextStory.id)
            ) {
              viewedStoryIdsRef.current.add(nextStory.id);
              onStoryViewed(nextStory.id);
            }
          } else {
            onClose();
          }
        }
      } else {
        frameIdRef.current = requestAnimationFrame(animate);
      }
    };

    frameIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [
    currentStoryId,
    currentImageIndex,
    currentStory.images.length,
    stories,
    onClose,
  ]);

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
        key={`${currentStoryId}-${currentImageIndex}`}
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
