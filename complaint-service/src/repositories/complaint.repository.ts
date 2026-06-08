import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { complaints } from '../db/schema/complaint.schema.js';
import { CreateComplaintDto } from '../types/complaint.types.js';

export const createComplaint = async (data: CreateComplaintDto) => {
  const [newComplaint] = await db
    .insert(complaints)
    .values({
      originalTitle: data.originalTitle,
      description: data.description,
      userId: data.userId,
      latitude: data.latitude,
      longitude: data.longitude,
      // If lat/lng are provided, format them for PostGIS using raw SQL
      // location: data.longitude && data.latitude ? sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)` : null
    })
    .returning();

  return newComplaint;
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