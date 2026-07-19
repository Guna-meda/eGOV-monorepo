import type {CreateComplaintDto, Complaint} from "@egov/shared"

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
export async function getComplaintById(complaintId:string){
  const res = await fetch(`http://${BASE}:${PORT}/api/v1/complaints/${complaintId}`);
  if(!res.ok) throw new Error("Failed to fetch complaint");
  const complaint = await res.json();
  
  console.log('Complaint fetched by id:',complaintId,' complaint', complaint);
  return complaint as Complaint;
}