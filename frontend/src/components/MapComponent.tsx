import { MapContainer, TileLayer , Marker,Popup, useMap} from 'react-leaflet'
import {useState, useEffect} from 'react'
import type { Dispatch, SetStateAction } from 'react';

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
            const BASE = import.meta.env.VITE_API_HOST ?? "localhost";
            const PORT = import.meta.env.VITE_API_PORT ?? "5001";
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
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapEvents setComplaints={setComplaints}/>
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>
                            You are here!
                            </Popup>
                        </Marker>
                        {complaints.map((complaint:Complaint)=>
                            <Marker position={[complaint.latitude, complaint.longitude]} key={complaint.id}>
                                <Popup>{complaint.original_title}</Popup>
                            </Marker>
                        )}
                    </MapContainer>
            }
        </>

    )
}

