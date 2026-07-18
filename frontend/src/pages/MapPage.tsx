import {useState} from 'react'
import {useLoaderData} from 'react-router'
import { Box } from "@mui/material";
import MapComponent from "../components/MapComponent"
import ComplaintPopupCard from "../components/ComplaintPopUpCard"

import L from 'leaflet'

export interface Complaint {
  id: string;
  original_title: string;
  translated_title: string | null;
  description: string;
  original_language: string | null;
  translated_text: string | null;
  frequency: number;
  incident_occurred_at: string | null;

  user_id: string;

  latitude: number | null;
  longitude: number | null;

  ward_id: string | null;

  category: string | null;
  subcategory: string | null;

  sentiment: string | null;

  severity_score: number | null;
  severity_label: "LOW" | "MEDIUM" | "HIGH" | null;

  risk_score: number | null;
  risk_label: string | null;

  ml_status: string;

  status: string;

  created_at: string;
  updated_at: string;

  ward: Ward | null;
}
export interface WardProperties {
  ward_name: string;
  ward_name_kn: string;
  Ward_Name: string;
  zone_name: string;
  Assembly: string;
  Corporation: string;
  corporation_kn: string;

  [key: string]: unknown;
}

export interface Ward {
  id: string;
  city: string | null;
  layerType: string | null;
  level: number | null;
  properties: WardProperties;
}
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
        if(complaint.severity_label === 'LOW') markerIcon = greenIcon;
        else if(complaint.severity_label === 'MEDIUM') markerIcon = orangeIcon;
        else markerIcon = redIcon;
        
        return {
            id: complaint.id,
            icon: markerIcon,
            position: [complaint.latitude, complaint.longitude] as L.LatLngExpression,
            popupContent: (
            <ComplaintPopupCard
                title={complaint.original_title}
                ward={complaint.ward?.properties.ward_name}
                createdAt={complaint.created_at}
                status={complaint.status}
                severity={complaint.severity_label!}
                onClick={() => {
                console.log("Clicked", complaint.id);
                // later:
                // navigate(`/complaints/${complaint.id}`);
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