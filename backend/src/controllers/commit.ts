import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4, v4 } from "uuid";
import { logActivity } from "../utils/activityLogger.js";
import { getUserIdFromToken } from "../utils/globalConfig.js";

export default async function commitFiles(message: string): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    // Get userId from global config
    const userId = await getUserIdFromToken();

    const commitID = v4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);

    if (files.length === 0) {
      console.log("No files staged for commit!");
      return;
    }

    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file),
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commits.json"),
      JSON.stringify({
        commitMessage: message,
        date: new Date().toISOString(),
        commitId: commitID,
      }),
    );

    console.log(`Commit ${commitID} created with message: ${message}!`);

    // Log activity if userId is available
    if (userId) {
      await logActivity(userId, "COMMIT", {
        commitId: commitID,
        message: message,
        filesCount: files.length,
      });
      console.log(`✓ Contribution tracked (+1)`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error commiting the file(s): ${error.message}`);
    } else {
      console.log(`Error commiting the files(s): ${error}`);
    }
  }
}
