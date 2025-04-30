import { useEffect, useRef } from 'react';
import maplibregl, { Map as MaplibreMap, Marker } from 'maplibre-gl';
import { MarkerConfig } from '../types/map';
import { createMarkerElement } from '../utils/mapUtils';

export const useMarkers = (map: MaplibreMap | null, mapFullyLoaded: boolean, markers: MarkerConfig[]) => {
  const markerRefs = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    if (!map || !mapFullyLoaded) return;

    markers.forEach(({ id, location, iconClass, color, size, popupText }) => {
      if (location) {
        let marker = markerRefs.current.get(id);
        if (!marker) {
          const element = createMarkerElement(iconClass, color, size);
          marker = new maplibregl.Marker({ element, anchor: 'bottom' });
          if (popupText) {
            marker.setPopup(new maplibregl.Popup({ offset: 25 }).setText(popupText));
          }
          marker.setLngLat(location).addTo(map);
          markerRefs.current.set(id, marker);
        } else {
          marker.setLngLat(location);
        }
      } else {
        const marker = markerRefs.current.get(id);
        if (marker) {
          marker.remove();
          markerRefs.current.delete(id);
        }
      }
    });

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current.clear();
    };
  }, [map, mapFullyLoaded, markers]);
};