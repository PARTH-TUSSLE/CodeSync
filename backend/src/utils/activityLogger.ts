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

/**
 * Removes activities based on specific criteria
 * Used when undoing actions (e.g., deleting a repo, closing an issue)
 *
 * @param userId - The ID of the user who performed the original action
 * @param type - The type of activity to remove
 * @param metadataMatch - Metadata to match for finding the specific activity
 *
 * @example
 * // Remove the REPO_CREATED activity when deleting a repo
 * await removeActivity("user-123", "REPO_CREATED", { repoId: "repo-456" });
 */
export async function removeActivity(
  userId: string,
  type: ActivityType,
  metadataMatch: Record<string, any>,
): Promise<void> {
  try {
    // Find and delete activities that match the criteria
    await prisma.activity.deleteMany({
      where: {
        userId,
        type,
        // Match the metadata - Prisma will do a JSON field match
        metadata: {
          path: Object.keys(metadataMatch),
          equals: Object.values(metadataMatch),
        },
      },
    });
  } catch (error) {
    console.error("Error removing activity:", error);
  }
}
