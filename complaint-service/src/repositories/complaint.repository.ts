import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { complaints, complaintMedia } from '../db/schema/complaint.schema.js';
import { CreateComplaintDto ,Bounds} from '../types/complaint.types.js';
import { sql } from 'drizzle-orm';

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
    console.log('DATA RECEIVED FOR TRANSACTION:');
    console.log(data);

    // Using Drizzle transaction block
    return await db.transaction(async (tx) => {
      // 1. Insert the primary Complaint record
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
        }));

        savedMedia = await tx
          .insert(complaintMedia)
          .values(mediaValues)
          .returning();
      }

      // 3. Return the consolidated response payload
      return {
        ...newComplaint,
        media: savedMedia,
      };
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
  const [complaint] = await db
    .select()
    .from(complaints)
    .where(eq(complaints.id, id));

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