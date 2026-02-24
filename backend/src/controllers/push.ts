import { promises as fs } from "fs";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { logActivity } from "../utils/activityLogger.js";
import { getUserIdFromToken } from "../utils/globalConfig.js";

export default async function pushChanges(): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // Get userId from global config
    const userId = await getUserIdFromToken();

    const commitDirs = await fs.readdir(commitsPath);

    if (commitDirs.length === 0) {
      console.log("No commits to push!");
      return;
    }

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        await s3.upload(params).promise();
      }
    }

    console.log(`All commits pushed to the repository!`);
    console.log(`Total commits pushed: ${commitDirs.length}`);

    // Log activity if userId is available
    if (userId) {
      await logActivity(userId, "PUSH", {
        commitCount: commitDirs.length,
        timestamp: new Date().toISOString(),
      });
      console.log(`✓ Contribution tracked (+1)`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error occurred while pushing the changes: ${error.message}`);
    } else {
      console.log(`Error occurred while pushing the changes: ${error}`);
    }
  }
}
