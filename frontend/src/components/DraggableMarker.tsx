import { useState, useRef, useMemo, useCallback } from 'react';
import { Marker, Popup , useMap} from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import L from 'leaflet';
import type { Icon } from 'leaflet';

const draggableDefaultPinIcon = L.icon({
    iconUrl: '/icons/marker-icon-green.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
interface DraggableMarkerProps {
    icon?: Icon;
    onDrop?: (position: L.LatLng)=> void
}

export default function DraggableMarker({
  icon=draggableDefaultPinIcon,
  onDrop

}: DraggableMarkerProps) {
    const [draggable, setDraggable] = useState(false);
    const map = useMap();
    const center = map.getCenter();
    const [position, setPosition] = useState<L.LatLng>(center);

    const markerRef = useRef<LeafletMarker | null>(null);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker) {
              const pos = marker.getLatLng();
              setPosition(()=>pos);
              if(onDrop) onDrop(pos)            
          }
        },
      }),
      [onDrop]
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
      icon={icon}
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