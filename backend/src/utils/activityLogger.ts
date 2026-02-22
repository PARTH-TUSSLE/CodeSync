import { prisma } from "../prisma.js";
import type { ActivityType } from "@prisma/client";

export async function logActivity(
  userId: string,
  type: ActivityType,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
