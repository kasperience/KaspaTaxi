export type LatLng = [number, number]; // [longitude, latitude]

export interface MapProps {
  pickupLocation?: LatLng | null;
  dropoffLocation?: LatLng | null;
  driverLocation?: LatLng | null;
  riderLocation?: LatLng | null;
  showRiderLocation?: boolean;
  isSelecting?: 'pickup' | 'dropoff' | false | null;
  onMapClick?: (coords: LatLng) => void;
  onMapReady?: (map: maplibregl.Map) => void;
  routeGeoJSON?: GeoJSON.Feature<GeoJSON.LineString> | null;
  trackUserLocation?: boolean;
}

export interface MarkerConfig {
  id: string;
  location: LatLng | null;
  iconClass: string;
  color?: string;
  size?: string;
  popupText?: string;
}