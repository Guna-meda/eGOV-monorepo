import fs from 'node:fs/promises'; 
import logger from '../utils/logger.ts';
import { ApiError } from '../utils/ApiError.ts';
import * as gisRepository from "../repositories/gis.repository.ts"
import type {BoundaryLayerData} from "../types/gis.types.ts"

export const createBoundaryLayer = async(file:Express.Multer.File, {city, layerType, level}: BoundaryLayerData)=>
    {
        if(!file) throw new ApiError(500,"File must be uploaded(gis service layer)");
        try {
            logger.info("Received file to ingest inside gis service: ", file);

            //reduce geojson file size
            //send to repository layer, ok so both are done at repository layer only
            const response = await gisRepository.createBoundaryLayer(file, {
                city,layerType, level
            });

            //delete file
            logger.info("Deleting file on disk", file.filename)
            await fs.unlink(file.path);
            logger.info("File deleted successfully!");

            return response;
        } 
        catch (error:any) {
            logger.error("Failed to delete file!", error.message)
            throw new ApiError(500, error.message)
        }
}
export const getBoundaryLayer = async(data: {city: string, layer: string})=>{
    if(!data || !data.city || !data.layer) {
        logger.error("Missing city/boundary or both! in gis service while getting boundary");
        throw new ApiError(400, "Missing city/boundary or both! in gis service while getting boundary");
    }
    try{
        logger.info(`Getting geojson for ${data.layer} for city ${data.city}`)
        const boundaryGeoJson = await gisRepository.getBoundaryLayer(data);
        return boundaryGeoJson;
    }
    catch(err:any){
        logger.error(`Failed to fetch geojson for ${data.city} of boundary type ${data.layer}: ${err}`)
        throw new ApiError(500, err)
    }
}