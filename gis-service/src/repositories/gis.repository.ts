import {sql} from 'drizzle-orm';
import fs from "node:fs"
import { db } from '../db/index.js';
import type {BoundaryLayerData} from "../types/gis.types.ts"

export const createBoundaryLayer = async(file:Express.Multer.File, data: BoundaryLayerData)=>{
    const geojson = JSON.parse(fs.readFileSync(file.path, "utf-8"));

    try{
        await db.transaction(async (tx) => {
        for (const feature of geojson.features) {
        await tx.execute(sql`
            INSERT INTO boundary_layers (city, layer_type, level, properties, geom)
            VALUES (
                ${data.city},
                ${data.layerType},
                ${data.level},
                ${JSON.stringify(feature.properties)},
                ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON(${JSON.stringify(feature.geometry)})), 4326)
            )
        `);
        }
        });
        return {
            status: "ok",
            message: `${data.layerType} data of ${data.city} of level ${data.level} has been successfully added!`
        }
    }
    catch(err){
        console.dir(err, { depth: null });
        throw err;
    }
}
export const getBoundaryLayer = async(data: {city:string, layer: string})=>{
    try{
        const rows = await db.execute(sql`
            SELECT properties, ST_AsGeoJSON(geom) as geometry
            FROM boundary_layers
            WHERE city = ${data.city} AND layer_type = ${data.layer}
        `);

        return {
            type: "FeatureCollection",
            features: rows.rows.map(row => ({
                type: "Feature",
                geometry: JSON.parse(row.geometry as string),
                properties: row.properties
            }))
        };
    }
    catch(err){
        console.dir(err, { depth: null });
        throw err;
    }

}