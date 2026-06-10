import MapComponent from "../components/MapComponent"
import { Box } from "@mui/material";

export default function MapPage(){
    return (
        <Box 
            sx={{
                flex:1,
            }}
        >
            <MapComponent />
        </Box>
    )
}