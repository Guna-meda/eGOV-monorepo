import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface PanToCurrentLocationProps {
  setLocationMarker?: (latLng: L.LatLng) => void;
}
export default function PanToCurrentLocation({ setLocationMarker }: PanToCurrentLocationProps) {
  const map = useMap();

  const handlePan = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = new L.LatLng(latitude, longitude);

          // Pan to location with animation (or use map.panTo)
          map.flyTo(latLng, map.getZoom(), { animate: true });

          // Optional: Add/Update a marker at the current location
          if (setLocationMarker) {
            setLocationMarker(latLng);
          }
        },
        (error) => {
          console.error('Error fetching current location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', marginTop: '10px', marginRight: '10px' }}>
      <button
        onClick={handlePan}
        style={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
        }}
      >
        📍 My Location
      </button>
    </div>
  );
}
