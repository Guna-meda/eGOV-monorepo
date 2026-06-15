import { 
    MapContainer, TileLayer , Marker,
    Popup, useMap, GeoJSON, 
    LayersControl
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

import {useState, useEffect} from 'react'
import type { Dispatch, SetStateAction } from 'react';
import {useLoaderData} from 'react-router'
import PanToCurrentLocation from "./PanToCurrentLocation"
import DraggableMarker from "./DraggableMarker"

const complaintIcon = L.icon({
    iconUrl: '/icons/marker-icon-red.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
const currentLocationIcon = L.icon({
    iconUrl: '/icons/marker-icon-blue.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
interface Complaint{
    id:string;
    latitude:number;
    longitude:number;
    original_title:string
}
interface MapEventsProps {
    setComplaints: Dispatch<SetStateAction<Complaint[]>>;
}
function MapEvents({ setComplaints }: MapEventsProps) {
    const map = useMap();
    useEffect(() => {
        const handleMoveEnd = async () => {
            const boundsObject = map.getBounds();
            const BASE = import.meta.env.VITE_CMP_API_HOST ?? "localhost";
            const PORT = import.meta.env.VITE_CMP_API_PORT ?? "5001";
            console.log(boundsObject);
            try{
                const url = new URL(`http://${BASE}:${PORT}/api/v1/complaints/complaintsInBounds`);
                const bounds = {
                    north: boundsObject.getNorth(),
                    south: boundsObject.getSouth(),
                    east: boundsObject.getEast(),
                    west: boundsObject.getWest(),
                }
                console.log("Bounds are: ",bounds)
                url.searchParams.append("north",`${bounds.north}`)
                url.searchParams.append("south",`${bounds.south}`)
                url.searchParams.append("east",`${bounds.east}`)
                url.searchParams.append("west",`${bounds.west}`)

                const res = await fetch(url)
                const response = await res.json()
                if(!res.ok) throw new Error(`Error while getting complaints in ur area! ${res}`);
                console.log('Complaints in your area: ',response.data);
                setComplaints(prev=>response.data)
            }
            catch(err){
                console.log(err)
            }
        };

        map.on("moveend", handleMoveEnd);

        return () => {
            map.off("moveend", handleMoveEnd);
        };
    }, [map]);

    return null;
}
export default function MapComponent(){
    const [location, setLocation] = useState({lat:0, lng:0})
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const geoJson = useLoaderData()

    console.log('The geojson object: ', geoJson)
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            () => {
                alert("Could not get location");
            }
            );
    },[])
    return (
        <>
            {location.lat && location.lng &&           
                    <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                        <LayersControl position="bottomright">
                            <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LayersControl.BaseLayer>

                            {geoJson && (
                                <LayersControl.Overlay name="Ward Boundaries">
                                    <GeoJSON
                                        data={geoJson}
                                        style={{ color: "#2563eb", weight: 1.5, fillOpacity: 0.1 , fillRule: 'nonzero' }}
                                        onEachFeature={(feature, layer) => {
                                            layer.on('click', () => {
                                                const { ward_name, ward_id, Corporation } = feature.properties;
                                                console.log("Clicked ward:", { ward_name, ward_id, Corporation });
                                            });
                                        }}
                                    />
                                </LayersControl.Overlay>
                            )}
                        </LayersControl>

                        <MapEvents setComplaints={setComplaints}/>
                        <PanToCurrentLocation />
                        <Marker
                            position={[location.lat, location.lng]}
                            icon={currentLocationIcon}
                        >
                            <Popup>You are here!</Popup>
                        </Marker>
                        <MarkerClusterGroup>
                            {complaints.map((complaint:Complaint)=>
                                <Marker position={[complaint.latitude, complaint.longitude]} 
                                        key={complaint.id} icon={complaintIcon}>
                                    <Popup>{complaint.original_title}</Popup>
                                </Marker>
                            )}
                        </MarkerClusterGroup>
                        <DraggableMarker center={location}/>
                    </MapContainer>
            }
        </>

    )
}

