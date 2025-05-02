import { useEffect, useRef } from 'react';
import maplibregl, { Map as MaplibreMap, Marker } from 'maplibre-gl';
import { MarkerConfig } from '../types/map';
import { createMarkerElement } from '../utils/mapUtils';

export const useMarkers = (map: MaplibreMap | null, mapFullyLoaded: boolean, markers: MarkerConfig[]) => {
  const markerRefs = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    if (!map || !mapFullyLoaded) return;

    markers.forEach(({ id, location, iconClass, color, size, popupText, zIndexOffset }) => {
      if (location) {
        let marker = markerRefs.current.get(id);
        if (!marker) {
          const element = createMarkerElement(iconClass, color, size);

          // Create marker with options including zIndexOffset if provided
          const markerOptions: maplibregl.MarkerOptions = {
            element,
            anchor: 'bottom'
          };

          // Add zIndexOffset if provided (affects marker stacking order)
          if (zIndexOffset !== undefined) {
            // @ts-ignore - MapLibre doesn't have zIndexOffset in its type definitions
            // but the property works in the implementation
            markerOptions.zIndexOffset = zIndexOffset;
          }

          marker = new maplibregl.Marker(markerOptions);

          if (popupText) {
            marker.setPopup(new maplibregl.Popup({ offset: 25 }).setText(popupText));
          }

          marker.setLngLat(location).addTo(map);
          markerRefs.current.set(id, marker);

          // Log marker creation for debugging
          console.log(`Created marker for ${id} at location:`, location);
        } else {
          marker.setLngLat(location);
          // Log marker update for debugging
          console.log(`Updated marker for ${id} to location:`, location);
        }
      } else {
        const marker = markerRefs.current.get(id);
        if (marker) {
          marker.remove();
          markerRefs.current.delete(id);
          console.log(`Removed marker for ${id}`);
        }
      }
    });

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current.clear();
    };
  }, [map, mapFullyLoaded, markers]);
};