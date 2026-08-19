const url = import.meta.env.VITE_API_URL || "http://localhost:5001";

type UploadSignature = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
}

export async function getSignature(){
    const res = await fetch(`${url}/api/v1/media/upload-signature`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
        },
    });

    return res;
}

export async function uploadMedia(
  file: File,
  signature: UploadSignature
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append(
    "timestamp",
    String(signature.timestamp)
  );
  formData.append(
    "signature",
    signature.signature
  );
  formData.append("folder", signature.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(
      `Cloudinary upload failed: ${await res.text()}`
    );
  }

  const uploaded = await res.json();

  return {
    fileUrl: uploaded.secure_url,
    fileType: file.type,
    providerFileId: uploaded.public_id,
  };
}