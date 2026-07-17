import type {CreateComplaintDto} from "../types/complaint.types"

const BASE = import.meta.env.VITE_API_HOST ?? "localhost";
const PORT = import.meta.env.VITE_API_PORT ?? "5001";

export default async function uploadComplaint(data:CreateComplaintDto){
  const res = await fetch(`http://${BASE}:${PORT}/api/v1/complaints/`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
  });
  return res;
}