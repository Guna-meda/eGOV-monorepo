import GrievanceForm from "../components/GrievanceForm"
import { Typography } from "@mui/material";

export default function Raise(){
    return (
        <div>
            <Typography variant="h5" gutterBottom>Submit a Grievance</Typography>
            <GrievanceForm />
        </div>
    )
}