import fs from "fs";
import path from "path";
import { promisify } from "util";

const readDir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export default async function revert(commitID: string): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await readDir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`Successfully reverted the codebase to commit - ${commitID}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error reverting back the changes : ${error.message}`);
    } else {
      console.log(`Error reverting back the changes : ${error}`);
    }
  }
}
