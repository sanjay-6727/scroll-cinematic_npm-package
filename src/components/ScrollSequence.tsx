import React, { ReactNode } from "react";
import { useScrollFrames } from "../hooks/useScrollFrames";
import { Dialogue } from "../types";

export interface ScrollSequenceProps {
  /**
   * Path template to frames (e.g. "/frames/frame_%04d.jpg" or (idx) => url)
   */
  frames: string | ((index: number) => string);
  /**
   * Total number of frames in the sequence
   */
  frameCount: number;
  /**
   * The height of the scroll container (e.g. "300vh", "400vh")
   */
  height?: string;
  /**
   * Array of dialogues to overlay during scroll progress
   */
  dialogues?: Dialogue[];
  /**
   * Point at which the main title text fades out (0 to 1, default 0.08)
   */
  textFadeEnd?: number;
  /**
   * Aspect ratio zoom factor for mobile layouts (default 1.3)
   */
  mobileZoom?: number;
  /**
   * Primary title text overlay
   */
  title?: string;
  /**
   * Subtitle text overlay below the primary title
   */
  subtitle?: string;
  /**
   * Eyebrow badge text shown above the primary title
   */
  eyebrow?: string;
  /**
   * Whether to show the overall scroll progress bar at the bottom (default true)
   */
  showProgressBar?: boolean;
  /**
   * Whether to show the frame loading progress bar on top (default true)
   */
  showLoadingProgress?: boolean;
  /**
   * Text next to the loading indicator (default "Loading frames...")
   */
  loadingText?: string;
  /**
   * Optional CSS class for the container
   */
  className?: string;
  /**
   * Optional CSS class for the canvas
   */
  canvasClassName?: string;
  /**
   * Optional CSS class for the content overlay
   */
  overlayClassName?: string;
  /**
   * Whether to stick the canvas to the viewport while scrolling the section container (default true).
   * If false, uses `fixed` positioning, which will stay on screen unless handled separately.
   */
  stickyCanvas?: boolean;
  /**
   * Children can be static React nodes or a render-prop function returning custom overlay UI
   */
  children?:
    | ReactNode
    | ((progress: number, frameIndex: number, loaded: boolean) => ReactNode);
  /**
   * Easing factor between 0 and 1 (1 = no easing). Default: 0.15
   */
  easingSpeed?: number;
  /**
   * Callback fired on scroll progress updates
   */
  onProgress?: (progress: number, frameIndex: number) => void;
}

export function ScrollSequence({
  frames,
  frameCount,
  height = "300vh",
  dialogues = [],
  textFadeEnd = 0.08,
  mobileZoom = 1.3,
  title,
  subtitle,
  eyebrow,
  showProgressBar = true,
  showLoadingProgress = true,
  loadingText = "Loading frames...",
  className = "",
  canvasClassName = "",
  overlayClassName = "",
  stickyCanvas = true,
  easingSpeed = 0.15,
  children,
  onProgress,
}: ScrollSequenceProps) {
  const {
    containerRef,
    canvasRef,
    loaded,
    loadProgress,
    scrollProgress,
    frameIndex,
  } = useScrollFrames({
    frames,
    frameCount,
    mobileZoom,
    easingSpeed,
    onProgress,
  });

  // Base Styles to ensure it works beautifully without any Tailwind setup
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height,
    backgroundColor: "#000",
    color: "#fff",
  };

  const stickyWrapperStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  };

  const canvasStyle: React.CSSProperties = {
    display: "block",
    touchAction: "none",
    zIndex: 0,
    ...(stickyCanvas
      ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }
      : { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }),
  };

  const overlayStyle: React.CSSProperties = {
    position: stickyCanvas ? "absolute" : "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "2rem",
    boxSizing: "border-box",
    zIndex: 10,
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    color: "#fff",
  };

  const introOpacity = Math.max(0, 1 - scrollProgress / textFadeEnd);
  const introTransform = `translateY(${(1 - introOpacity) * 12}px)`;

  const introStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    opacity: introOpacity,
    transform: introTransform,
    transition: "opacity 75ms ease-out, transform 75ms ease-out",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    maxWidth: "40rem",
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.25rem",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 1.5,
    maxWidth: "32rem",
  };

  const loaderContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    pointerEvents: "none",
  };

  const loaderTextStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.5)",
  };

  const loaderBarBgStyle: React.CSSProperties = {
    height: "4px",
    width: "16rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    overflow: "hidden",
  };

  const loaderBarStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: "#fff",
    transition: "width 100ms ease-out",
    width: `${loadProgress * 100}%`,
  };

  const dialogueContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "36rem",
    width: "100%",
    paddingBottom: "1.5rem",
  };

  const progressContainerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 20,
  };

  const progressBarStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: "#fff",
    transition: "width 75ms ease-out",
    width: `${scrollProgress * 100}%`,
  };

  const renderContent = () => {
    if (typeof children === "function") {
      return children(scrollProgress, frameIndex, loaded);
    }

    return (
      <div style={overlayStyle} className={overlayClassName}>
        {/* Top bar (loading status) */}
        <div>
          {loadProgress < 1 && showLoadingProgress && (
            <div style={loaderContainerStyle}>
              <span style={loaderTextStyle}>
                {!loaded ? loadingText : "Buffering detail..."}
              </span>
              <div style={loaderBarBgStyle}>
                <div style={loaderBarStyle} />
              </div>
            </div>
          )}
        </div>

        {/* Middle/Intro text block */}
        {(eyebrow || title || subtitle) && (
          <div style={introStyle}>
            {eyebrow && (
              <div>
                <span style={badgeStyle}>{eyebrow}</span>
              </div>
            )}
            {(title || subtitle) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {title && <h1 style={titleStyle}>{title}</h1>}
                {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
              </div>
            )}
          </div>
        )}

        {/* Dialogues/Quotes overlays at the bottom */}
        {dialogues.length > 0 && (
          <div style={dialogueContainerStyle}>
            {dialogues.map((dialogue) => {
              const isVisible =
                scrollProgress >= dialogue.show &&
                scrollProgress <= dialogue.hide;

              const dialogueCardStyle: React.CSSProperties = {
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 12}px)`,
                transition: "opacity 300ms ease-out, transform 300ms ease-out",
                pointerEvents: isVisible ? "auto" : "none",
                display: isVisible ? "block" : "none", // Prevent hidden components from trapping mouse/clicks
                borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
                paddingLeft: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              };

              const dTitleStyle: React.CSSProperties = {
                fontSize: "11px",
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.5)",
                margin: 0,
              };

              const dTextStyle: React.CSSProperties = {
                fontSize: "1.125rem",
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.8)",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.4,
              };

              const dFooterStyle: React.CSSProperties = {
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.4)",
              };

              return (
                <div key={dialogue.id} style={dialogueCardStyle}>
                  {dialogue.title && <div style={dTitleStyle}>{dialogue.title}</div>}
                  <p style={dTextStyle}>"{dialogue.text}"</p>
                  {(dialogue.author || dialogue.source) && (
                    <div style={dFooterStyle}>
                      {dialogue.author && <span>{dialogue.author}</span>}
                      {dialogue.source && <span>{dialogue.source}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Any custom children nodes passed */}
        {children}
      </div>
    );
  };

  return (
    <section ref={containerRef} style={containerStyle} className={className}>
      {stickyCanvas ? (
        <div style={stickyWrapperStyle}>
          <canvas
            ref={canvasRef}
            style={canvasStyle}
            className={canvasClassName}
          />
          {renderContent()}
          {showProgressBar && (
            <div style={progressContainerStyle}>
              <div style={progressBarStyle} />
            </div>
          )}
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={canvasStyle}
            className={canvasClassName}
          />
          {renderContent()}
          {showProgressBar && (
            <div style={{ ...progressContainerStyle, position: "fixed" }}>
              <div style={progressBarStyle} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
