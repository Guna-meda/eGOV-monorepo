import { Router } from 'express';

import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsInBounds
} from '../controllers/complaint.controller.js';

const router = Router();

router.post('/', createComplaint);

router.get('/', getAllComplaints);
router.get('/complaintsInBounds', getComplaintsInBounds)

router.get('/:id', getComplaintById);

export default router;