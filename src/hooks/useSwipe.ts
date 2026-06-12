import { useCallback, useRef, type TouchEvent } from 'react';

interface UseSwipeParams {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

interface UseSwipeResult {
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeParams): UseSwipeResult => {
  const startX = useRef(0);

  const onTouchStart = useCallback((event: TouchEvent) => {
    startX.current = event.changedTouches[0]?.clientX ?? 0;
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - startX.current;

      if (delta > threshold) {
        onSwipeRight();
        return;
      }

      if (delta < -threshold) {
        onSwipeLeft();
      }
    },
    [onSwipeLeft, onSwipeRight, threshold],
  );

  return { onTouchStart, onTouchEnd };
};
