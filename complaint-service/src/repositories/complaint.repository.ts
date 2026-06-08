import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { complaints } from '../db/schema/complaint.schema.js';
import { CreateComplaintDto } from '../types/complaint.types.js';

export const createComplaint = async (data: CreateComplaintDto) => {
  try {
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
    // This will print the actual underlying error from PostgreSQL
    console.error('============ REAL POSTGRES ERROR ============');
    console.error('Code:', error.code);       // e.g., '42703' (undefined column) or '42704' (undefined object)
    console.error('Detail:', error.detail);   // Specific info from Postgres
    console.error('Hint:', error.hint);       // Helpful suggestions from Postgres
    console.error('Message:', error.message);
    console.error('=============================================');
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