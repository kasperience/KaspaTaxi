import React, { useRef, useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMap } from '../hooks/useMap';
import { useMarkers } from '../hooks/useMarkers';
import { fitMapToMarkers } from '../utils/mapUtils';
import { MapProps, MarkerConfig, LatLng } from '../types/map';

const Map: React.FC<MapProps> = ({
  pickupLocation = null,
  dropoffLocation = null,
  driverLocation = null,
  riderLocation = null,
  showRiderLocation = true,
  isSelecting = null,
  onMapClick,
  onMapReady,
  routeGeoJSON = null,
  trackUserLocation = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, mapFullyLoaded } = useMap({
    containerRef: mapContainer,
    onMapClick,
    onMapReady,
    isSelecting,
    routeGeoJSON,
    trackUserLocation,
  });

  const markers: MarkerConfig[] = [
    {
      id: 'pickup',
      location: pickupLocation,
      iconClass: 'fas fa-map-marker-alt',
      color: '#1ABC9C', // Teal color for pickup (user-related)
      size: '3xl',
      popupText: 'Pickup',
    },
    {
      id: 'dropoff',
      location: dropoffLocation,
      iconClass: 'fas fa-flag-checkered',
      color: '#16a085', // Darker teal for dropoff (user-related)
      size: '3xl',
      popupText: 'Dropoff',
    },
    {
      id: 'driver',
      location: driverLocation,
      iconClass: 'fas fa-car',
      color: '#F1C40F', // Yellow/taxi color for driver
      size: '3xl',
      popupText: 'Driver',
    },
    {
      id: 'rider',
      location: showRiderLocation ? riderLocation : null,
      iconClass: 'fas fa-user',
      color: '#1ABC9C', // Teal color for rider (user)
      size: '3xl',
      popupText: 'Rider',
    },
  ];

  useMarkers(map, mapFullyLoaded, markers);

  useEffect(() => {
    if (!map || !mapFullyLoaded || isSelecting) return;

    const locations: LatLng[] = [];
    if (trackUserLocation && riderLocation) locations.push(riderLocation);
    if (driverLocation) locations.push(driverLocation);
    if (pickupLocation) locations.push(pickupLocation);
    if (dropoffLocation) locations.push(dropoffLocation);
    if (routeGeoJSON?.geometry?.coordinates?.length) {
      locations.push(...routeGeoJSON.geometry.coordinates as LatLng[]);
    }

    if (locations.length > 0) {
      // Use larger padding for better visibility, especially in rectangular containers
      const padding = {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      };

      fitMapToMarkers(map, locations, {
        padding,
        skipIfInteracting: true,
        maxZoom: 15 // Slightly lower max zoom to ensure more context is visible
      });
    }
  }, [
    map,
    mapFullyLoaded,
    pickupLocation,
    dropoffLocation,
    driverLocation,
    riderLocation,
    showRiderLocation,
    routeGeoJSON,
    trackUserLocation,
    isSelecting,
  ]);

  return <div ref={mapContainer} className="w-full h-full min-h-[300px] rounded-lg" />;
};

export default Map;
