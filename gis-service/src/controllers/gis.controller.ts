import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.ts';
import { ApiError } from '../utils/ApiError.ts';

import { asyncHandler } from '../utils/asyncHandler.ts';
import * as gisService from "../services/gis.service.ts"

//admin uploads geojson file, store to DB
//these will be boundaries for given city at given layer type like ward
//on form input might be like city, ward, geojson file

export const createBoundaryLayer = asyncHandler(async (req: Request,res: Response) => {
    //send to service layer
    if(!req.file){
        throw new ApiError(400,'No file uploaded')
    }
    //send to service layer
    const response = await gisService.createBoundaryLayer(req.file, req.body)

    console.log(req.file)
    console.log(req.body)
    res.status(200).json(
        new ApiResponse(
          200,
          {
            status: response.status,
            message: response.message,
            filename: req.file.filename,
            size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`
          })
      );
});
export const getBoundaryLayer = asyncHandler(async (req: Request, res: Response)=>{
    //get geojson data of say wards of bangalore
    const data = req.query
    if(!data) throw new ApiError(400,'Missing Data for GeoJSON boundary not found!');
    if(!data.city || !data.layer) throw new ApiError(400,'Missing city or layer for GeoJSON boundary not found!');
    
    const boundaryGeoJson = await gisService.getBoundaryLayer({
        city: data.city as string,
        layer: data.layer as string
    });
    res.status(200).json(
        new ApiResponse(200,boundaryGeoJson)
      );
    
})