/**
 * Resolves a frame URL from a template string or custom function.
 * Supports patterns like "%d", "%03d", "%04d", etc.
 */
export function getFrameUrlResolver(
  frames: string | ((index: number) => string)
): (index: number) => string {
  if (typeof frames === "function") {
    return frames;
  }

  return (index: number) => {
    // Check for formats like %04d, %03d, etc.
    const match = frames.match(/%0(\d)d/);
    if (match) {
      const padding = parseInt(match[1], 10);
      return frames.replace(/%0\d+d/, String(index).padStart(padding, "0"));
    }
    // Check for generic %d
    if (frames.includes("%d")) {
      return frames.replace(/%d/, String(index));
    }
    // Otherwise return the string as-is
    return frames;
  };
}

/**
 * Preloads all frame images and returns them as an array of HTMLImageElement.
 */
export function preloadFrames(
  frames: string | ((index: number) => string),
  frameCount: number,
  onProgress?: (progress: number, loadedCount: number, totalCount: number) => void
): {
  promise: Promise<HTMLImageElement[]>;
  cancel: () => void;
} {
  let cancelled = false;
  const resolver = getFrameUrlResolver(frames);
  const images: HTMLImageElement[] = [];

  const promise = new Promise<HTMLImageElement[]>((resolve) => {
    let loadedCount = 0;

    if (frameCount <= 0) {
      resolve([]);
      return;
    }

    const handleLoad = () => {
      if (cancelled) return;
      loadedCount++;
      if (onProgress) {
        onProgress(loadedCount / frameCount, loadedCount, frameCount);
      }
      if (loadedCount === frameCount) {
        resolve(images);
      }
    };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = resolver(i);
      img.onload = handleLoad;
      img.onerror = handleLoad; // Count error as complete to avoid deadlock
      images.push(img);
    }
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
    },
  };
}
