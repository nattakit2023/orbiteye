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

  // Create/remove image overlay when props change
  useEffect(() => {
    // Clean up existing overlay
    if (imageOverlayRef.current) {
      imageOverlayRef.current.remove();
      imageOverlayRef.current = null;
    }

    if (imageUrl && bbox) {
      const [minX, minY, maxX, maxY] = bbox;
      const overlay = L.imageOverlay(imageUrl, [[minY, minX], [maxY, maxX]], {
        opacity: opacity / 100,
        interactive: true,
      }).addTo(map);
      imageOverlayRef.current = overlay;
    }

    return () => {
      if (imageOverlayRef.current) {
        imageOverlayRef.current.remove();
        imageOverlayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, bbox]);

  // Update overlay opacity when it changes
  useEffect(() => {
    if (imageOverlayRef.current) {
      imageOverlayRef.current.setOpacity(opacity / 100);
    }
  }, [opacity]);

  return null;
};

export default ImageOverlayManager;
