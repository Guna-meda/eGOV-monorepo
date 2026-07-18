import { eq } from 'drizzle-orm';
import { db, complaints, complaintMedia } from '@egov/shared';
import type { CreateComplaintDto, MlAnalysisDto ,Bounds} from '@egov/shared'; //im not sure how bounds is gonna be imported here lets see

import { sql } from 'drizzle-orm';

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
    return await db.transaction(async (tx) => {
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
          SELECT *
          FROM complaints
          WHERE ST_Within(
              location,
              ST_MakeEnvelope(
                  ${west},
                  ${south},
                  ${east},
                  ${north},
                  4326
              )
          )
      `);
      const response = result.rows.map(row=>{
        return {
          id: row.id,
          latitude: row.latitude,
          longitude: row.longitude,
          original_title: row.original_title
        }
      })
      console.log("Complaints in area: ", response)
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
