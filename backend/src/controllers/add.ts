import { promises as fs } from "fs";
import path from "path";
import { cwd } from "process";

interface StagingPaths {
  repoPath: string;
  stagingPath: string;
}

interface MkdirOptions {
  recursive?: boolean;
}

export default async function addFile(filePath: string): Promise<void> {
  const repoPath: string = path.resolve(cwd(), ".codesync");
  const stagingPath: string = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true } );
    const fileName: string = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to the staging area`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(
        `Error occurred while staging the file(s) : ${error.message}`,
      );
    } else {
      console.log(
        `Error occurred while staging the file(s) : ${String(error)}`,
      );
    }
  }
}
