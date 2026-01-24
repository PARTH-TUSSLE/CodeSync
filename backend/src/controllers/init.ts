import { promises as fs } from "fs";
import path from "path";

export default async function initRepo(): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({bucket: process.env.S3_BUCKET})
    );
    console.log(`Repository initialised successfully !`)
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error initialising a repository ${error.message}`);
    } else {
      console.log(`Error initialising a repository ${error}`);
    }
  }
}
