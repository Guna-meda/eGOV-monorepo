import crypto from 'crypto';

export const generateUploadSignature =
  async () => {
    const timestamp = Math.round(
      Date.now() / 1000
    );

    const folder = 'complaints';

    const signature = crypto
      .createHash('sha1')
      .update(
        `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest('hex');

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