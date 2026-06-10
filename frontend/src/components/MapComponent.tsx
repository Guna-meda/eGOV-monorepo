import { MapContainer, TileLayer , Marker,Popup} from 'react-leaflet'
import {useState, useEffect} from 'react'

export default function MapComponent(){
    const [location, setLocation] = useState({lat:0, lng:0})

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
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
            }
        </>

    )
}

