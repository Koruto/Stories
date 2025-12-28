import { useState, useEffect } from "react";

export function useHashRouteToggle(modalHash: string) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleActive = (open: boolean) => {
    if (open) {
      window.location.hash = modalHash;
    } else {
      window.location.hash = "";
    }
  };

  useEffect(() => {
    const handleOnHashChange = () => {
      const isHashMatch = window.location.hash === modalHash;
      setIsOpen(isHashMatch);
    };

    handleOnHashChange();

    window.addEventListener("hashchange", handleOnHashChange);

    return () => window.removeEventListener("hashchange", handleOnHashChange);
  }, [modalHash]);

  return [isOpen, toggleActive] as const;
}

