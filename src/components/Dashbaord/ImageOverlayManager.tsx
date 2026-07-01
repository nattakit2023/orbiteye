import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface ImageOverlayManagerProps {
  imageUrl: string | null;
  bbox: [number, number, number, number] | null;
  opacity: number;
}

const ImageOverlayManager: React.FC<ImageOverlayManagerProps> = ({
  imageUrl,
  bbox,
  opacity,
}) => {
  const map = useMap();
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const bboxRef = useRef(bbox);
  // Track slider-controlled visibility (0-100). 100 = fully visible, 0 = hidden.
  // We keep this in a ref so the latest value can be re-applied if the overlay
  // is recreated.
  const visibilityRef = useRef<number>(100);

  // Keep bbox ref updated
  useEffect(() => {
    bboxRef.current = bbox;
  }, [bbox]);

  // Apply the slider's "visibility" to the underlying Leaflet <img> element
  // by clipping the right side. Anything left of the slider stays visible.
  const applyVisibility = (visibility: number) => {
    const overlay = imageOverlayRef.current;
    if (!overlay) return;
    const el = overlay.getElement();
    if (!el) return;

    const clamped = Math.max(0, Math.min(100, visibility));

    if (clamped >= 100) {
      // Fully visible – clear any previous clipping
      el.style.clipPath = "";
    } else if (clamped <= 0) {
      // Fully hidden
      el.style.clipPath = "inset(0 100% 0 0)";
    } else {
      // Reveal left (clamped)%, hide right (100 - clamped)%
      el.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    }
    el.style.transition = "clip-path 80ms linear";
  };

  // Create/remove image overlay when props change
  useEffect(() => {
    // Clean up existing overlay
    if (imageOverlayRef.current) {
      imageOverlayRef.current.remove();
      imageOverlayRef.current = null;
    }

    if (!imageUrl || !bbox) return;

    const [minX, minY, maxX, maxY] = bbox;

    const overlay = L.imageOverlay(
      imageUrl,
      [
        [minY, minX],
        [maxY, maxX],
      ],
      {
        opacity: opacity / 100,
        interactive: false, // Events are blocked by the slider overlay above
      },
    ).addTo(map);
    imageOverlayRef.current = overlay;

    // Apply the most recent visibility (handles re-creation)
    applyVisibility(visibilityRef.current);

    return () => {
      if (imageOverlayRef.current) {
        imageOverlayRef.current.remove();
        imageOverlayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, bbox, map, opacity]);

  // Listen for slider visibility changes from ImageSliderOverlay
  useEffect(() => {
    const handleSliderVisibilityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ visibility: number }>;
      const next = customEvent.detail.visibility;
      visibilityRef.current = next;
      applyVisibility(next);
    };

    window.addEventListener(
      "sliderVisibilityChange",
      handleSliderVisibilityChange,
    );
    return () =>
      window.removeEventListener(
        "sliderVisibilityChange",
        handleSliderVisibilityChange,
      );
  }, []);

  return null;
};

export default ImageOverlayManager;
