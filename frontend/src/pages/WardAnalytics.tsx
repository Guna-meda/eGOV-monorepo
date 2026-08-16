import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { Box } from "@mui/material";
import MapComponent from "../components/MapComponent"
import ComplaintPopupCard from "../components/ComplaintPopUpCard"
import WardAnalyticsCard from "../components/WardAnalyticsCard"
import type { Complaint } from '@egov/shared'
import type { WardAnalyticsResponse } from '@egov/shared'
import L from 'leaflet'
import type { Feature } from "geojson";

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
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function WardAnalytics() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState<Complaint[]>([]);

    // Cache of ward name -> analytics response, so repeat clicks skip the fetch
    const [analyticsCache, setAnalyticsCache] = useState<
        Record<string, WardAnalyticsResponse>
    >({});
    const [wardAnalytics, setWardAnalytics] =
        useState<WardAnalyticsResponse | null>(null);

    const geoJson = useLoaderData()
    const geoJsonLayersData = [
        {
            name: "Wards",
            data: geoJson,
            onFeatureClick: async (feature: Feature) => {
                const wardName = feature.properties!.ward_name;
                console.log("Ward clicked: ", wardName);

                if (analyticsCache[wardName]) {
                    setWardAnalytics(analyticsCache[wardName]);
                    return;
                }

                const url = new URL("/recurrence/", import.meta.env.VITE_ML_SERVICE_URL);
                url.pathname += encodeURIComponent(wardName);

                const res = await fetch(url);
                if (!res.ok) {
                    console.error('Failed to calculate recurrence for ward: ', wardName)
                    return;
                }

                const data: WardAnalyticsResponse = await res.json()
                console.log('Recurrence data for ward: ', data);

                setAnalyticsCache((prev) => ({
                    ...prev,
                    [wardName]: data,
                }));
                setWardAnalytics(data);
            },
        }
    ]
    async function fetchComplaintsInBounds(
        bounds: L.LatLngBounds
    ) {
        const BASE = import.meta.env.VITE_CMP_API_HOST ?? "localhost";
        const PORT = import.meta.env.VITE_CMP_API_PORT ?? "5001";
        console.log("The bounds of current viewport are: ", bounds)

        try {
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
            if (!res.ok) throw new Error(`Error while getting complaints in ur area! ${res}`);
            console.log('Complaints in your area: ', response.data);
            setComplaints(response.data);
        }
        catch (err) {
            console.log(err)
        }

    }
    const complaintMarkers = complaints.map((complaint) => {
        let markerIcon;
        if (complaint.severityLabel === 'LOW') markerIcon = greenIcon;
        else if (complaint.severityLabel === 'MEDIUM') markerIcon = yellowIcon;
        else if (complaint.severityLabel === 'HIGH') markerIcon = orangeIcon;
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
                        navigate(`/citizen/complaints/${complaint.id}`, {
                            state: { complaint }
                        });
                    }}
                />
            ),
        }
    })

    return (
        <Box
            sx={{
                flex: 1,
            }}
        >
            <MapComponent
                markers={complaintMarkers}
                enableClustering={true}
                geoJsonLayers={geoJsonLayersData}
                showCurrentLocationButton={true}
                onMoveEnd={fetchComplaintsInBounds}
            />

            {wardAnalytics && <WardAnalyticsCard data={wardAnalytics} />}
        </Box>
    )
}