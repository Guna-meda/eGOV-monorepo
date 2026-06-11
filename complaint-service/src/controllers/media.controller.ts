import { Request, Response } from 'express';

import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import * as mediaService from '../services/media.service.js';

export const getUploadSignature =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const data =
        await mediaService.generateUploadSignature();

      return res.status(200).json(
        new ApiResponse(
          200,
          data,
          'Upload signature generated'
        )
      );
    }
  );