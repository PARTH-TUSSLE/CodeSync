import { promises as fs } from "fs";
import path from "path";
import { getUserIdFromToken, readGlobalConfig } from "../utils/globalConfig.js";

export default async function initRepo(repoId?: string): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");

  try {
    const userId = await getUserIdFromToken();
    const globalConfig = await readGlobalConfig();

    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    const config: Record<string, any> = {
      bucket: process.env.S3_BUCKET,
      token: globalConfig.token,
    };
    if (repoId) {
      config.repoId = repoId;
    }

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(config, null, 2),
    );

    console.log(`✓ Repository initialised successfully!`);
    if (repoId) {
      console.log(`✓ Linked to CodeSync repo: ${repoId}`);
    }
    if (userId) {
      console.log(`✓ Contribution tracking enabled for user: ${userId}`);
    } else {
      console.log(
        `⚠ Not logged in. Run 'codesync login <token>' to enable contribution tracking`,
      );
    }
    if (!repoId) {
      console.log(`ℹ To link this local repo to a CodeSync repo, run: codesync remote <repoId>`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error initialising a repository: ${msg}`);
  }
}
