import { Router } from 'express';

import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
} from '../controllers/complaint.controller.js';

const router = Router();

router.post('/', createComplaint);

router.get('/', getAllComplaints);

router.get('/:id', getComplaintById);

export default router;