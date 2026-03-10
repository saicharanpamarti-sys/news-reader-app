import { useState, useEffect } from 'react';

const PREVIEW_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in ms (easy to change for demo)

export const usePreviewTimer = (onExpire) => {
  const [timeLeft, setTimeLeft] = useState(PREVIEW_TIME_LIMIT);
  const [isExpired, setIsExpired] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    let timer;
    let idleTimer;

    const resetTimer = () => {
      setTimeLeft(PREVIEW_TIME_LIMIT);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setTimeLeft(0);
        setIsExpired(true);
        onExpire?.(); // Trigger modal
        setIsActive(false);
      }, PREVIEW_TIME_LIMIT);
    };

    const handleActivity = () => {
      if (isExpired) return;
      clearTimeout(timer);
      timer = setTimeout(resetTimer, 1000); // Debounce activity
    };

    // Listen for user activity (mouse/keyboard)
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);

    resetTimer(); // Start on mount

    return () => {
      clearTimeout(timer);
      clearTimeout(idleTimer);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
    };
  }, [isActive, isExpired, onExpire]);

  return { timeLeft, isExpired, isActive, reset: () => setIsActive(true) };
};