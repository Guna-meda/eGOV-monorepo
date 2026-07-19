import {useState} from 'react'
import {useLoaderData, useNavigate} from 'react-router'
import { Box } from "@mui/material";
import MapComponent from "../components/MapComponent"
import ComplaintPopupCard from "../components/ComplaintPopUpCard"
import type {Complaint} from '@egov/shared'
import L from 'leaflet'

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
export default function MapPage(){
    let navigate = useNavigate();

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
        let markerIcon;
        if(complaint.severityLabel === 'LOW') markerIcon = greenIcon;
        else if(complaint.severityLabel === 'MEDIUM') markerIcon = orangeIcon;
        else markerIcon = redIcon;
        
        return {
            id: complaint.id,
            icon: markerIcon,
            position: [complaint.latitude, complaint.longitude] as L.LatLngExpression,
            popupContent: (
            <ComplaintPopupCard
                title={complaint.originalTitle}
                ward={complaint.ward?.properties.ward_name}
                createdAt={complaint.createdAt}
                status={complaint.status}
                severity={complaint.severityLabel}
                onClick={() => {
                    console.log("Clicked", complaint.id);
                    navigate(`/complaints/${complaint.id}`, {
                        state : {complaint}
                    });
                }}
            />
            ),
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