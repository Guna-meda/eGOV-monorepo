import {useState} from 'react'
import {useLoaderData} from 'react-router'
import { Box } from "@mui/material";
import MapComponent from "../components/MapComponent"
import L from 'leaflet'

interface Complaint{
    id:string;
    latitude:number;
    longitude:number;
    original_title:string
}
const complaintIcon = L.icon({
    iconUrl: '/icons/marker-icon-red.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
export default function MapPage(){
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const geoJson = useLoaderData()
    const geoJsonLayersData = [
        {
            name: "Wards",
            data: geoJson
        }
    ]
    async function fetchComplaintsInBounds(
        bounds: L.LatLngBounds
    ) {
        const BASE = import.meta.env.VITE_CMP_API_HOST ?? "localhost";
        const PORT = import.meta.env.VITE_CMP_API_PORT ?? "5001";
        console.log("The bounds of current viewport are: ",bounds)

        try{
            const url = new URL(`http://${BASE}:${PORT}/api/v1/complaints/complaintsInBounds`);
            url.searchParams.append(
                "north",
                bounds.getNorth().toString()
            );

            url.searchParams.append(
                "south",
                bounds.getSouth().toString()
            );

            url.searchParams.append(
                "east",
                bounds.getEast().toString()
            );

            url.searchParams.append(
                "west",
                bounds.getWest().toString()
            );

            const res = await fetch(url);
            const response = await res.json();
            if(!res.ok) throw new Error(`Error while getting complaints in ur area! ${res}`);
            console.log('Complaints in your area: ',response.data);
            setComplaints(response.data);
        }
        catch(err){
            console.log(err)
        }

    }
    const complaintMarkers = complaints.map((complaint)=>{
        return {
            id: complaint.id,
            icon: complaintIcon,
            position: [complaint.latitude, complaint.longitude] as L.LatLngExpression,
            popupContent: `${complaint.original_title}`
        }
    })

    return (
        <Box 
            sx={{
                flex:1,
            }}
        >
            <MapComponent 
                markers={complaintMarkers}
                enableClustering={true}
                geoJsonLayers={geoJsonLayersData}
                showCurrentLocationButton={true}
                onMoveEnd={fetchComplaintsInBounds}
            />
        </Box>
    )
}