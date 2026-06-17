import { useState, useEffect } from 'react'
import { 
    MapContainer, TileLayer , Marker,
    Popup, useMap, GeoJSON,
    LayersControl
} from 'react-leaflet'
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { LatLngExpression, Icon ,PathOptions} from 'leaflet'
import type {ReactNode} from 'react'
import PanToCurrentLocation from "./PanToCurrentLocation"
import DraggableMarker from "./DraggableMarker"

//import this
interface DraggableMarkerProps {
  icon?: Icon;
  onDrop?: ()=> void
}
interface MarkerData {
  id: string;
  position: LatLngExpression;
  icon?: Icon;
  popupContent?: ReactNode;
}
interface GeoJsonLayerProps {
  name: string;
  data: GeoJSON.GeoJsonObject;
  style?: PathOptions;
  onFeatureClick?: (
    feature: GeoJSON.Feature
  ) => void;
}
interface MapEventsProps {
    onMoveEnd?: (
        bounds: L.LatLngBounds
    ) => void;
}
interface MapComponentProps{
    mapCenter?: LatLngExpression;
    tileProvider?: {
        url: string,
        attribution: string
    };
    markers?: MarkerData[];
    enableClustering?: boolean;
    geoJsonLayers?: GeoJsonLayerProps[];
    draggableMarkerProps?: DraggableMarkerProps
    showCurrentLocationButton?: boolean;
    onMoveEnd?: (
            bounds: L.LatLngBounds
    ) => void;
}
function MapEvents({
    onMoveEnd
}: MapEventsProps) {
    const map = useMap();
    useEffect(() => {
        const handleMoveEnd = () => {
            onMoveEnd?.(map.getBounds());
        };

        map.on("moveend", handleMoveEnd);

        return () => {
            map.off("moveend", handleMoveEnd);
        };
    }, [map, onMoveEnd]);

    return null;
}
export default function MapComponent({
    mapCenter,
    tileProvider=
    {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    markers,
    enableClustering=false,
    geoJsonLayers,
    draggableMarkerProps,
    showCurrentLocationButton=false,
    onMoveEnd

    }:MapComponentProps)
    {

        const [center, setCenter] = useState<LatLngExpression | undefined>(mapCenter)
        useEffect(()=>{
            if(!mapCenter){
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                    },
                    () => {
                        alert("Could not get location");
                    }
                );
            }
        },[mapCenter])
        return (
            <>
                {center && 
                    <MapContainer 
                        center={center} 
                        zoom={13} 
                        scrollWheelZoom={false} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <LayersControl position="bottomright">
                            <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    attribution={tileProvider.attribution}
                                    url={tileProvider.url}
                                />
                            </LayersControl.BaseLayer>
                            
                            {geoJsonLayers?.map((layer) => (
                                <LayersControl.Overlay
                                    key={layer.name}
                                    name={layer.name}
                                >
                                    <GeoJSON
                                        data={layer.data}
                                        style={layer.style}
                                        onEachFeature={(feature, leafletLayer) => {
                                                leafletLayer.on("click", () => {
                                                layer.onFeatureClick?.(feature);
                                            });
                                        }}
                                    />
                                </LayersControl.Overlay>
                            ))}
                        </LayersControl>

                        <MapEvents onMoveEnd={onMoveEnd}/>
                        {showCurrentLocationButton && 
                            <PanToCurrentLocation />
                        }
                        {enableClustering && markers? (
                            <MarkerClusterGroup>
                                {markers.map((m:MarkerData)=>
                                (
                                    <Marker 
                                        position={m.position} 
                                        key={m.id}
                                        icon={m.icon}
                                        >
                                        <Popup>{m.popupContent}</Popup>
                                    </Marker>
                                ))}
                            </MarkerClusterGroup>
                        ) : (markers &&
                            <>
                                {markers.map((m:MarkerData)=>(
                                    <Marker 
                                        position={m.position} 
                                        key={m.id}
                                        icon={m.icon}
                                        >
                                        <Popup>{m.popupContent}</Popup>
                                    </Marker>
                                ))}
                            </>
                        )}
                        {draggableMarkerProps && 
                            <DraggableMarker {...draggableMarkerProps}/>
                        }
                    </MapContainer>
                }
            </>
        )
}

