import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { complaints, complaintMedia } from "../db/schema/complaint.schema.js";
import { CreateComplaintDto } from "../types/complaint.types.js";

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
    console.log("DATA RECEIVED FOR TRANSACTION:");
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
        })
        .returning();

      // 2. Map and insert Media records if they are provided
      let savedMedia: any[] = [];
      if (data.media && data.media.length > 0) {
        const mediaValues = data.media.map((item) => ({
          complaintId: newComplaint.id,
          fileUrl: item.fileUrl,
          fileType: item.fileType,
          providerFileId: item.providerFileId,
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
  } catch (error: any) {
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
