import { promises as fs } from "fs";
import path from "path";
import { getUserIdFromToken } from "../utils/globalConfig.js";

export default async function initRepo(): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");

  try {
    // Get userId from global config
    const userId = await getUserIdFromToken();

    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(
        {
          bucket: process.env.S3_BUCKET,
        },
        null,
        2,
      ),
    );

    console.log(`✓ Repository initialised successfully!`);
    if (userId) {
      console.log(`✓ Contribution tracking enabled for user: ${userId}`);
    } else {
      console.log(
        `⚠ Not logged in. Run 'codesync login <token>' to enable contribution tracking`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error initialising a repository ${error.message}`);
    } else {
      console.log(`Error initialising a repository ${error}`);
    }
  }
}
