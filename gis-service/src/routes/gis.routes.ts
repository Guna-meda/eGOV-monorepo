import { Router , Request, Response, NextFunction } from 'express';
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import {
    createBoundaryLayer,
    getBoundaryLayer
} from "../controllers/gis.controller"
import { ApiError } from '../utils/ApiError.ts';


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Prevent naming collisions with a timestamp suffix
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
//setting 50MB limit on Boundaries data file
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 Megabytes in bytes
});

const router = Router();

router.post('/boundary-layers',upload.single('boundaryData'), createBoundaryLayer); //ingest a geographic vector format data file , store in db as geojson
router.get('/boundary-geojson', getBoundaryLayer);
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Check if the error came specifically from Multer
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw new ApiError(413, 'File is too large. Max limit is 50MB')
        }
        throw new ApiError(400,`Multer upload error: ${err.message}`);
    }

    // Handle generic or structural system errors
    const statusCode = err.status || err.statusCode || 500;
    throw new ApiError(statusCode,err.message)
});
export default router;