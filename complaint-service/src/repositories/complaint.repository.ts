import { eq } from 'drizzle-orm';
import { db, complaints, complaintMedia ,boundary_layers} from '@egov/shared';
import type { CreateComplaintDto, MlAnalysisDto ,Bounds} from '@egov/shared'; //im not sure how bounds is gonna be imported here lets see

import { sql } from 'drizzle-orm';

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
    return await db.transaction(async (tx) => {
      // 1. Find the ward containing the complaint location
      let wardId: string | undefined;

      if (data.latitude != null && data.longitude != null) {
        const [ward] = await tx
          .select({ id: boundary_layers.id })
          .from(boundary_layers)
          .where(sql`
              ${boundary_layers.layerType} = 'ward'
              AND ST_Covers(
                ${boundary_layers.geom},
                ST_SetSRID(
                  ST_MakePoint(${data.longitude}, ${data.latitude}),
                  4326
                )
              )
            `)
          .limit(1);

        wardId = ward?.id;
      }
      const [newComplaint] = await tx
        .insert(complaints)
        .values({
          originalTitle: data.originalTitle,
          description: data.description,
          userId: data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          location: sql`ST_SetSRID(
              ST_MakePoint(${data.longitude}, ${data.latitude}),
              4326
            )`,
          wardId,
        })
        .returning();

      // 2. Map and insert Media records if they are provided
      let savedMedia: {
          complaintId: string;
          fileUrl: string;
          fileType: string;
        }[] = [];
      if (data.media && data.media.length > 0) {
        const mediaValues = data.media.map((item) => ({
          complaintId: newComplaint.id,
          fileUrl: item.fileUrl,
          fileType: item.fileType,
          providerFileId: item.providerFileId,
        }));

        savedMedia = await tx.insert(complaintMedia).values(mediaValues).returning();
      }
      //3. TODO get warduuid for complaint by point in polygon query
      return { ...newComplaint, media: savedMedia };
    });
  } catch (error) {
    console.dir(error, { depth: null });
    throw error;
  }
};

export const getAllComplaints = async () => {
  return await db.select().from(complaints);
};

export const getComplaintById = async (id: string) => {
  const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
  return complaint;
};
export async function getComplaintsInBounds(bounds: Bounds) {
    const { north, south, east, west } = bounds;

    console.log('Bounds received by complaint repository', bounds)
    try{

      const result = await db.execute(sql`
        SELECT
          c.*,
          json_build_object(
            'id', b.id,
            'city', b.city,
            'layerType', b.layer_type,
            'level', b.level,
            'properties', b.properties
          ) AS ward
        FROM complaints c
        LEFT JOIN boundary_layers b
          ON c.ward_id = b.id
        WHERE ST_Within(
          c.location,
          ST_MakeEnvelope(
            ${west},
            ${south},
            ${east},
            ${north},
            4326
          )
        )
      `);
      //TODO donot return this response, return basically full thing as is + joined result on wardid

      //TODO here for each row in result, populate ward field using FK in wardid, and return direct result.rows
      console.log("Complaints in area: ", result.rows)
      return result.rows;
    }
    catch(err){
      console.dir(err, { depth: null });
      throw err;
    }

}
export const updateMlAnalysis = async (complaintId: string, data: MlAnalysisDto) => {
  const [updatedComplaint] = await db
    .update(complaints)
    .set({
      category: data.category,
      subcategory: data.subcategory,
      sentiment: data.sentiment,
      severityScore: data.severityScore,
      severityLabel: data.severityLabel,
      riskScore: data.riskScore,
      riskLabel: data.riskLabel,
      mlStatus: data.mlStatus,
      updatedAt: new Date(),
    })
    .where(eq(complaints.id, complaintId))
    .returning();

  return updatedComplaint;
};

export const updateMlStatus = async (complaintId: string, status: string) => {
  const [updatedComplaint] = await db
    .update(complaints)
    .set({ mlStatus: status, updatedAt: new Date() })
    .where(eq(complaints.id, complaintId))
    .returning();

  return updatedComplaint;
};
