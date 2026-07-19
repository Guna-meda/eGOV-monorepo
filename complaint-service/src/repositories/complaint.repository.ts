import { eq } from 'drizzle-orm';
import { db, complaints, complaintMedia ,boundary_layers} from '@egov/shared';
import type { CreateComplaintDto, MlAnalysisDto ,Bounds, Complaint} from '@egov/shared'; //im not sure how bounds is gonna be imported here lets see

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

export const getComplaintById = async (
  id: string
): Promise<Complaint> => {
  
  try{
   const result = await db.execute(sql`
        SELECT
          c.id AS "id",
          c.original_title AS "originalTitle",
          c.translated_title AS "translatedTitle",
          c.description AS "description",
          c.original_language AS "originalLanguage",
          c.translated_text AS "translatedText",
          c.frequency AS "frequency",
          c.incident_occurred_at AS "incidentOccurredAt",
          c.user_id AS "userId",
          c.latitude AS "latitude",
          c.longitude AS "longitude",
          c.ward_id AS "wardId",
          c.category AS "category",
          c.subcategory AS "subcategory",
          c.sentiment AS "sentiment",
          c.severity_score AS "severityScore",
          c.severity_label AS "severityLabel",
          c.risk_score AS "riskScore",
          c.risk_label AS "riskLabel",
          c.ml_status AS "mlStatus",
          c.status AS "status",
          c.created_at AS "createdAt",
          c.updated_at AS "updatedAt",
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
        WHERE c.id = ${id}
        LIMIT 1;
      `);
      const complaint = result.rows[0];

      if (!complaint) {
        throw new Error(`Complaint not found by id: ${id}`)
      }
      console.log('Complaint by Id:',id,' complaint: ', complaint)
      return complaint as unknown as Complaint;
  }
    catch(err){
      console.dir(err, { depth: null });
      throw err;
    }
};
export async function getComplaintsInBounds(bounds: Bounds) {
    const { north, south, east, west } = bounds;

    console.log('Bounds received by complaint repository', bounds)
    try{

      const result = await db.execute(sql`
        SELECT
          c.id AS "id",
          c.original_title AS "originalTitle",
          c.translated_title AS "translatedTitle",
          c.description AS "description",
          c.original_language AS "originalLanguage",
          c.translated_text AS "translatedText",
          c.frequency AS "frequency",
          c.incident_occurred_at AS "incidentOccurredAt",
          c.user_id AS "userId",
          c.latitude AS "latitude",
          c.longitude AS "longitude",
          c.ward_id AS "wardId",
          c.category AS "category",
          c.subcategory AS "subcategory",
          c.sentiment AS "sentiment",
          c.severity_score AS "severityScore",
          c.severity_label AS "severityLabel",
          c.risk_score AS "riskScore",
          c.risk_label AS "riskLabel",
          c.ml_status AS "mlStatus",
          c.status AS "status",
          c.created_at AS "createdAt",
          c.updated_at AS "updatedAt",
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
