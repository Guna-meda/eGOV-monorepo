import type {CreateComplaintDto, Complaint} from "@egov/shared"

const url = import.meta.env.VITE_API_URL || "http://localhost:5001";
const ML_URL = import.meta.env.VITE_ML_SERVICE_URL

export default async function uploadComplaint(data:CreateComplaintDto){
  const res = await fetch(`${url}/api/v1/complaints/`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
  });
  return res;
}
export async function getComplaintById(complaintId:string){
  const res = await fetch(`${url}/api/v1/complaints/${complaintId}`);
  if(!res.ok) throw new Error("Failed to fetch complaint");
  const complaint = await res.json();
  
  console.log('Complaint fetched by id:',complaintId,' complaint', complaint);
  return complaint as Complaint;
}

export async function analyzeComplaint(description:string){
  if(!ML_URL) throw new Error('Invalid ML URL/No ML URL given');
  const res = await fetch(`${ML_URL}/analyze`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({
        text: description
      })   
  });

  if(!res.ok) throw new Error('Failed to analyze complaint description');
  const data = await res.json();
  console.log(data)
  return data;
}