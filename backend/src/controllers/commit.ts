import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4, v4 } from "uuid";

export default async function commitFiles(message: string): Promise<any> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitID = v4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
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
      }),
    );

    console.log(`Commit ${commitID} created with message: ${message}`);

  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error commiting the file(s) : ${error.message}`);
    } else {
      console.log(`Error commiting the files(s) : ${error}`);
    }
  }
}
