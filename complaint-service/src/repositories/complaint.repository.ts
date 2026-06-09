import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { complaints } from '../db/schema/complaint.schema.js';
import { CreateComplaintDto } from '../types/complaint.types.js';

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
    console.log('DATA RECEIVED');
console.log(data);
    const [newComplaint] = await db
      .insert(complaints)
      .values({
        originalTitle: data.originalTitle,
        description: data.description,
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
      })
      .returning();

    return newComplaint;
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