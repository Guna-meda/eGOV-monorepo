import { Router } from 'express';

import {
  getUploadSignature,
} from '../controllers/media.controller.js';

const router = Router();

router.post(
  '/upload-signature',
  getUploadSignature
);

export default router;