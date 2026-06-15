import { useState, useRef, useMemo, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { Marker as LeafletMarker, LatLngExpression } from 'leaflet';
import L from 'leaflet';

const draggablePinIcon = L.icon({
    iconUrl: '/icons/marker-icon-green.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
interface DraggableMarkerProps {
  center: LatLngExpression;
}

export default function DraggableMarker({
  center,
}: DraggableMarkerProps) {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState<LatLngExpression>(center);

  const markerRef = useRef<LeafletMarker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
            const pos = marker.getLatLng();
            setPosition(prev=>pos);
            console.log('Dropped pin at:', pos);
        }
      },
    }),
    []
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={draggablePinIcon}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}