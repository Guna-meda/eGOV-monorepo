import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { complaints, complaintMedia } from "../db/schema/complaint.schema.js";
import { CreateComplaintDto } from "../types/complaint.types.js";

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
        })
        .returning();

      let savedMedia: any[] = [];

      if (data.media?.length) {
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

export const updateMlAnalysis = async (
  complaintId: string,
  data: {
    category: string;
    subcategory: string;
    sentiment: string;
    severityScore: number;
    severityLabel: string;
    riskScore: number;
    riskLabel: string;
    mlStatus: string;
  }
) => {
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

export const updateMlStatus = async (
  complaintId: string,
  status: string
) => {
  const [updatedComplaint] = await db
    .update(complaints)
    .set({
      mlStatus: status,
      updatedAt: new Date(),
    })
    .where(eq(complaints.id, complaintId))
    .returning();

  return updatedComplaint;
};