import { useEffect, useRef, useCallback } from 'react';
import type { RefObject } from 'react';

interface VideoScrollControllerProps {
  videoRef: RefObject<HTMLVideoElement>;
  containerRef: RefObject<HTMLElement>;
  isVideoVisible: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export function VideoScrollController({
  videoRef,
  containerRef,
  isVideoVisible,
  onPlay,
  onPause
}: VideoScrollControllerProps) {
  const isPlayingRef = useRef(false);
  const userPausedRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!videoRef.current || !containerRef.current || !isVideoVisible) return;

    const container = containerRef.current;
    const video = videoRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if the hero section is still visible in the viewport
    const isContainerVisible = rect.bottom > 100 && rect.top < window.innerHeight - 100;
    
    if (!isContainerVisible && !video.paused) {
      // Scrolled past the video, pause it
      video.pause();
      isPlayingRef.current = false;
      onPause?.();
    } else if (isContainerVisible && video.paused && isVideoVisible && !userPausedRef.current) {
      // Only auto-play if user hasn't manually paused
      video.play().catch(console.error);
      isPlayingRef.current = true;
      onPlay?.();
    }
  }, [videoRef, containerRef, isVideoVisible, onPlay, onPause]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handlePlay = () => {
      isPlayingRef.current = true;
      userPausedRef.current = false; // Reset user pause flag when video plays
    };

    const handlePause = () => {
      isPlayingRef.current = false;
      // Check if this pause was user-initiated (not from scroll)
      const rect = containerRef.current?.getBoundingClientRect();
      const isContainerVisible = rect ? rect.bottom > 100 && rect.top < window.innerHeight - 100 : false;
      if (isContainerVisible) {
        userPausedRef.current = true; // User manually paused while video is visible
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef, containerRef]);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  return null; // This component doesn't render anything
}
