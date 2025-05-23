import maplibregl, { LngLatLike, Map as MaplibreMap } from 'maplibre-gl';

export const createMarkerElement = (
  iconClass: string,
  color: string = 'blue',
  size: string = '2xl'
): HTMLElement => {
  const el = document.createElement('div');

  // Check if this is a driver marker (car icon)
  const isDriverMarker = iconClass.includes('fa-car');

  if (isDriverMarker) {
    // Create a more visible driver marker with a background
    el.innerHTML = `
      <div class="relative">
        <div class="absolute -inset-1 rounded-full bg-yellow-400 opacity-50"></div>
        <div class="relative bg-[${color}] text-white p-2 rounded-full shadow-lg">
          <i class="${iconClass} text-${size}"></i>
        </div>
      </div>
    `;
  } else {
    // Standard marker for other types
    el.innerHTML = `<i class="${iconClass} text-${color} text-${size} drop-shadow-lg"></i>`;
  }

  el.style.width = 'auto';
  el.style.height = 'auto';
  el.style.cursor = 'pointer';
  return el;
};

/**
 * Generates a simple straight-line route GeoJSON between two points
 * @param pickup Pickup coordinates [longitude, latitude]
 * @param dropoff Dropoff coordinates [longitude, latitude]
 * @returns GeoJSON Feature with LineString geometry
 */
export const generateRouteGeoJSON = (
  pickup: [number, number],
  dropoff: [number, number]
): GeoJSON.Feature<GeoJSON.LineString> => {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [pickup, dropoff]
    }
  };
};

export const fitMapToMarkers = (
  map: MaplibreMap,
  locations: LngLatLike[],
  options: {
    padding?: number | { top: number; bottom: number; left: number; right: number };
    maxZoom?: number;
    duration?: number;
    skipIfInteracting?: boolean
  } = {}
) => {
  // Default to larger padding for better visibility of the entire route
  const defaultPadding = {
    top: 80,
    bottom: 80,
    left: 80,
    right: 80
  };

  const {
    padding = defaultPadding,
    maxZoom = 16,
    duration = 500,
    skipIfInteracting = false
  } = options;

  if (skipIfInteracting && map.isMoving()) return;

  const bounds = new maplibregl.LngLatBounds();
  const uniqueLocations = Array.from(new Set(locations.map((loc) => JSON.stringify(loc)))).map((s) => JSON.parse(s));

  uniqueLocations.forEach((loc) => bounds.extend(loc));

  if (uniqueLocations.length > 1) {
    map.fitBounds(bounds, { padding, maxZoom, duration });
  } else if (uniqueLocations.length === 1) {
    map.easeTo({ center: uniqueLocations[0], zoom: 15, duration });
  }
};