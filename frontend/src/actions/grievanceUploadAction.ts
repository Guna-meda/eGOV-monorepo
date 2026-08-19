import type { ActionFunctionArgs } from "react-router";
import uploadComplaint from "../api/complaintApi";
import { uploadMedia, getSignature } from "../api/mediaApi";
import type {CreateComplaintDto} from "../types/complaint.types"

export async function grievanceAction({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();

  const files = formData.getAll("images") as File[];

  const data = Object.fromEntries(
    [...formData.entries()].filter(
      ([key]) => key !== "images"
    )
  );

  console.log("Form data:", data);
  console.log("Files:", files);

  // Request Cloudinary signature from backend
  const signatureRes = await getSignature();

  if (!signatureRes.ok) {
    return {
      ok: false,
      message: await signatureRes.text(),
    };
  }

  const signature = await signatureRes.json();

  console.log("The signature", signature)
  // Upload all selected images to Cloudinary
  const uploadedMedia = await Promise.all(
    files
      .filter((file) => file.size > 0)
      .map((file) =>
        uploadMedia(file, signature.data)
      )
  );

  // Attach uploaded media URLs to complaint payload
  const complaintPayload = {
    originalTitle: formData.get("originalTitle") as string,
    description: formData.get("description") as string,
    userId: formData.get("userId") as string,
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    media: uploadedMedia,
  } satisfies CreateComplaintDto;

  console.log(
    "Complaint payload:",
    complaintPayload
  );

  const uploadComplaintRes = await uploadComplaint(complaintPayload);

  if (!uploadComplaintRes.ok) {
    return {
      ok: false,
      message:
        await uploadComplaintRes.text(),
    };
  }

  return { ok: true };
}