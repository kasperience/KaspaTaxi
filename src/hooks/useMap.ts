import { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl, { Map as MaplibreMap } from 'maplibre-gl';
import { LatLng, MapProps } from '../types/map';

export const useMap = ({
  containerRef,
  onMapClick,
  onMapReady,
  isSelecting,
  routeGeoJSON,
  trackUserLocation = false,
}: MapProps & { containerRef: React.RefObject<HTMLDivElement> }) => {
  const mapRef = useRef<MaplibreMap | null>(null);
  const [mapFullyLoaded, setMapFullyLoaded] = useState(false);
  const geolocateTriggeredRef = useRef(false);
  const userInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastDragTimeRef = useRef(0);
  const previewMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Use the proxied server endpoint instead of direct API key
  const mapStyle = `/api/maptiler/style`;

  // Alternatively, we could use the API service:
  // import { mapTilerAPI } from '../services/api';
  // const mapStyle = await mapTilerAPI.getMapStyle();

  // Use useMemo to prevent unnecessary re-renders
  const defaultCenter = useMemo<LatLng>(() => [21.0122, 52.2297], []); // Warsaw
  const defaultZoom = 12;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: defaultCenter,
      zoom: defaultZoom,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false,
      showUserLocation: true,
    });
    mapRef.current.addControl(geolocate, 'top-right');

    geolocate.on('error', (error) => console.error('Geolocation error:', error.message));
    geolocate.on('geolocate', (e) => {
      if (!trackUserLocation) return;
      const coords: LatLng = [e.coords.longitude, e.coords.latitude];
      if (mapRef.current && !userInteractingRef.current) {
        mapRef.current.easeTo({ center: coords, zoom: 15, duration: 500 });
      }
    });

    mapRef.current.on('load', () => {
      setMapFullyLoaded(true);
      if (!geolocateTriggeredRef.current) {
        geolocate.trigger();
        geolocateTriggeredRef.current = true;
      }
      mapRef.current?.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
      });
      mapRef.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#1ABC9C', 'line-width': 6, 'line-opacity': 0.8 },
      });
    });

    // Create a function to handle preview marker
    const createPreviewMarker = (coords: LatLng) => {
      if (previewMarkerRef.current) {
        previewMarkerRef.current.remove();
      }

      // Create a pulsing marker element
      const el = document.createElement('div');
      el.className = 'preview-marker';
      // Use the project's teal color (#1ABC9C) for pickup and yellow/taxi color (#F1C40F) for dropoff
      const pickupColor = '#1ABC9C';
      const dropoffColor = '#F1C40F';
      const currentColor = isSelecting === 'pickup' ? pickupColor : dropoffColor;

      el.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0 animate-ping rounded-full opacity-75" style="background-color: ${currentColor}"></div>
          <div class="relative rounded-full p-2" style="background-color: ${currentColor}">
            <i class="fas fa-${isSelecting === 'pickup' ? 'map-marker-alt' : 'flag-checkered'} text-white"></i>
          </div>
        </div>
      `;

      // Create and add the marker
      previewMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(coords)
        .addTo(mapRef.current!);

      // Add a popup with confirmation button
      // Use the same color for the confirm button as the marker
      const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div class="p-2 text-center">
            <p class="text-sm font-semibold mb-2">Set ${isSelecting === 'pickup' ? 'pickup' : 'dropoff'} here?</p>
            <div class="flex justify-center space-x-2">
              <button id="confirm-location" class="px-3 py-1 text-white rounded text-sm" style="background-color: ${currentColor}">Confirm</button>
              <button id="cancel-location" class="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm">Cancel</button>
            </div>
          </div>
        `);

      previewMarkerRef.current.setPopup(popup);
      popup.addTo(mapRef.current!);

      // Add event listeners to the popup buttons
      setTimeout(() => {
        const confirmBtn = document.getElementById('confirm-location');
        const cancelBtn = document.getElementById('cancel-location');

        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            if (onMapClick) {
              onMapClick(coords);
            }
            if (previewMarkerRef.current) {
              previewMarkerRef.current.remove();
              previewMarkerRef.current = null;
            }
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            if (previewMarkerRef.current) {
              previewMarkerRef.current.remove();
              previewMarkerRef.current = null;
            }
          });
        }
      }, 0);
    };

    // Handle map click events
    mapRef.current.on('click', (e) => {
      // Only process clicks if in selection mode and not immediately after dragging
      const now = Date.now();
      const timeSinceLastDrag = now - lastDragTimeRef.current;

      if (isSelecting && onMapClick && !isDraggingRef.current && timeSinceLastDrag > 200) {
        const coords: LatLng = [e.lngLat.lng, e.lngLat.lat];
        createPreviewMarker(coords);
      }
    });

    // Track dragging state
    mapRef.current.on('dragstart', () => {
      userInteractingRef.current = true;
      isDraggingRef.current = true;
    });

    mapRef.current.on('dragend', () => {
      userInteractingRef.current = false;
      isDraggingRef.current = false;
      lastDragTimeRef.current = Date.now();
    });

    mapRef.current.on('zoomstart', () => {
      userInteractingRef.current = true;
    });

    mapRef.current.on('zoomend', () => {
      userInteractingRef.current = false;
    });

    return () => {
      if (previewMarkerRef.current) {
        previewMarkerRef.current.remove();
        previewMarkerRef.current = null;
      }
      mapRef.current?.remove();
      mapRef.current = null;
      setMapFullyLoaded(false);
      geolocateTriggeredRef.current = false;
    };
  }, [containerRef, mapStyle, isSelecting, onMapClick, trackUserLocation, defaultCenter, defaultZoom]);

  useEffect(() => {
    if (!mapRef.current || !mapFullyLoaded) return;
    const source = mapRef.current.getSource('route') as maplibregl.GeoJSONSource;
    if (source) {
      const data = routeGeoJSON || {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [] },
      };
      source.setData(data as GeoJSON.Feature<GeoJSON.LineString>);
    }
  }, [mapFullyLoaded, routeGeoJSON]);

  useEffect(() => {
    if (mapFullyLoaded && mapRef.current) {
      onMapReady?.(mapRef.current);
    }
  }, [mapFullyLoaded, onMapReady]);

  // Clear preview marker when isSelecting changes
  useEffect(() => {
    if (previewMarkerRef.current) {
      previewMarkerRef.current.remove();
      previewMarkerRef.current = null;
    }
  }, [isSelecting]);

  return { map: mapRef.current, mapFullyLoaded };
};