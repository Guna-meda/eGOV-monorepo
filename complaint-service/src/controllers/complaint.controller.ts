import { Request, Response } from 'express';

import * as complaintService from '../services/complaint.service.js';
import { ApiResponse, asyncHandler } from '@egov/shared';

/**
 * @openapi
 * /complaints:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [originalTitle, description, userId]
 *             properties:
 *               originalTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Complaint created
 *       400:
 *         description: Validation error
 */
export const createComplaint = asyncHandler(async (req: Request, res: Response) => {
  const complaint = await complaintService.createComplaint(req.body);
  res.status(201).json(new ApiResponse(201, complaint, 'Complaint created successfully'));
});

/**
 * @openapi
 * /complaints:
 *   get:
 *     summary: Get all complaints
 *     tags: [Complaints]
 *     responses:
 *       200:
 *         description: List of complaints
 */
export const getAllComplaints = asyncHandler(async (req: Request, res: Response) => {
  const complaints = await complaintService.getAllComplaints();
  res.status(200).json(new ApiResponse(200, complaints, 'Complaints fetched successfully'));
});

/**
 * @openapi
 * /complaints/{id}:
 *   get:
 *     summary: Get complaint by ID
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complaint details
 *       404:
 *         description: Complaint not found
 */
export const getComplaintById = asyncHandler(async (req: Request, res: Response) => {
  const complaint = await complaintService.getComplaintById(
    typeof req.params.id === 'string' ? req.params.id : req.params.id[0]
  );
  res.status(200).json(new ApiResponse(200, complaint, 'Complaint fetched successfully'));
});
export const getComplaintsInBounds= async  (
    req: Request,
    res: Response
): Promise<void> =>{
    try {
        const north = Number(req.query.north);
        const south = Number(req.query.south);
        const east = Number(req.query.east);
        const west = Number(req.query.west);

        if ([north, south, east, west].some(Number.isNaN)) {
            res.status(400).json({
                error: 'north, south, east and west query params are required',
            });
            return;
        }

        const complaints = await complaintService.getComplaintsInBounds({
            north,
            south,
            east,
            west,
        });

        
      res.status(200).json(
        new ApiResponse(
          200,
          complaints,
          'Complaints in boundary fetched successfully'
        ))
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to fetch complaints',
        });
    }
}