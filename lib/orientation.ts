/**
 * Utility for handling screen orientation and fullscreen mode.
 * Note: Some features (like orientation.lock) require user activation 
 * and specific platform support (Android/Chrome).
 */

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export async function lockLandscape(element: HTMLElement) {
  if (typeof window === 'undefined') return;

  try {
    // 1. Enter Fullscreen (required for orientation lock on most browsers)
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      /* Safari/iOS support check */
      await (element as any).webkitRequestFullscreen();
    }

    // 2. Attempt Orientation Lock
    const orientation = (screen as any).orientation;
    if (orientation && orientation.lock) {
      await orientation.lock('landscape').catch(() => {
        console.log("Orientation lock not supported on this platform.");
      });
    }
  } catch (error) {
    console.error("Fullscreen/Orientation logic failed:", error);
  }
}

export function unlockOrientation() {
  if (typeof window === 'undefined') return;

  try {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }

    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  } catch (error) {
    // Fail silently
  }
}
