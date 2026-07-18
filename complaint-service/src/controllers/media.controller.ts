import { Request, Response } from 'express';

import { ApiResponse, asyncHandler } from '@egov/shared';
import * as mediaService from '../services/media.service.js';

/**
 * @openapi
 * /media/upload-signature:
 *   post:
 *     summary: Generate Cloudinary upload signature
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Upload signature generated
 */
export const getUploadSignature = asyncHandler(async (req: Request, res: Response) => {
  const data = await mediaService.generateUploadSignature();
  return res.status(200).json(new ApiResponse(200, data, 'Upload signature generated'));
});
