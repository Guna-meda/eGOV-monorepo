import { v2 as cloudinary } from "cloudinary";

export const generateUploadSignature =
  async () => {
    const timestamp = Math.round(
      Date.now() / 1000
    );

    const folder = 'complaints';

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      timestamp,
      signature,
      folder,
      apiKey:
        process.env.CLOUDINARY_API_KEY,
      cloudName:
        process.env.CLOUDINARY_CLOUD_NAME,
    };
  };