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

export interface PreloadProgressInfo {
  progress: number;
  loadedCount: number;
  totalCount: number;
  keyframesLoaded: boolean;
}

/**
 * Preloads all frame images progressively.
 * Phase 1: Loads keyframes first (every `step` frame) and triggers `onKeyframesLoaded`.
 * Phase 2: Loads remaining frames in the background and resolves the promise when finished.
 */
export function preloadFrames(
  frames: string | ((index: number) => string),
  frameCount: number,
  onProgress?: (info: PreloadProgressInfo) => void,
  onKeyframesLoaded?: (images: HTMLImageElement[]) => void,
  step = 4
): {
  promise: Promise<HTMLImageElement[]>;
  cancel: () => void;
} {
  let cancelled = false;
  const resolver = getFrameUrlResolver(frames);
  const images: HTMLImageElement[] = new Array(frameCount);

  const promise = new Promise<HTMLImageElement[]>((resolve) => {
    let loadedCount = 0;

    if (frameCount <= 0) {
      resolve([]);
      return;
    }

    // Segregate keyframe indices and remaining indices
    const keyframeIndices: number[] = [];
    const remainingIndices: number[] = [];

    for (let i = 1; i <= frameCount; i++) {
      if ((i - 1) % step === 0 || i === 1 || i === frameCount) {
        keyframeIndices.push(i);
      } else {
        remainingIndices.push(i);
      }
    }

    let keyframesLoadedCount = 0;
    const totalKeyframes = keyframeIndices.length;
    let keyframesTriggered = false;

    const onFrameDone = (index: number, isKeyframe: boolean) => {
      if (cancelled) return;
      loadedCount++;

      if (isKeyframe) {
        keyframesLoadedCount++;
      }

      // Check if Phase 1 (Keyframes) is complete
      if (!keyframesTriggered && keyframesLoadedCount === totalKeyframes) {
        keyframesTriggered = true;
        if (onKeyframesLoaded) {
          onKeyframesLoaded(images);
        }
      }

      if (onProgress) {
        onProgress({
          progress: loadedCount / frameCount,
          loadedCount,
          totalCount: frameCount,
          keyframesLoaded: keyframesTriggered,
        });
      }

      if (loadedCount === frameCount) {
        resolve(images);
      }
    };

    const handleLoad = (img: HTMLImageElement, index: number, isKeyframe: boolean) => {
      if (cancelled) return;

      // Decode image asynchronously to prevent thread blocking
      if (typeof img.decode === "function") {
        img.decode()
          .then(() => {
            if (cancelled) return;
            images[index - 1] = img; // Place in original 0-based array position
            onFrameDone(index, isKeyframe);
          })
          .catch(() => {
            if (cancelled) return;
            images[index - 1] = img;
            onFrameDone(index, isKeyframe);
          });
      } else {
        images[index - 1] = img;
        onFrameDone(index, isKeyframe);
      }
    };

    // Helper to start loading a batch of frame indices
    const loadBatch = (indices: number[], isKeyframe: boolean) => {
      indices.forEach((i) => {
        const img = new Image();
        const url = resolver(i);

        // Prevent cross-origin canvas tainting
        if (
          typeof window !== "undefined" &&
          url.startsWith("http") &&
          !url.includes(window.location.host)
        ) {
          img.crossOrigin = "anonymous";
        }

        img.onload = () => handleLoad(img, i, isKeyframe);
        img.onerror = () => {
          // Proceed on error so we don't lock loading progress
          onFrameDone(i, isKeyframe);
        };
        img.src = url;
      });
    };

    // Load keyframes first
    loadBatch(keyframeIndices, true);

    // Defer loading remaining frames slightly to allow bandwidth prioritization for keyframes
    setTimeout(() => {
      if (cancelled) return;
      loadBatch(remainingIndices, false);
    }, 50);
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
    },
  };
}
