export async function mapLoader() {
    const BASE = import.meta.env.VITE_GIS_API_HOST ?? "localhost";
    const PORT = import.meta.env.VITE_GIS_API_PORT ?? "3000";
    
    const url = new URL(`http://${BASE}:${PORT}/api/v1/gis/boundary-geojson`)
    url.search = new URLSearchParams({city: 'Bengaluru',layer: 'ward'}).toString();

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch ward boundaries");
    const response = await res.json();
    return response.data ;
}