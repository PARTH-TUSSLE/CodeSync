import { promises as fs } from "fs";
import path from "path";
import { readGlobalConfig } from "../utils/globalConfig.js";

async function getApiBase(): Promise<string> {
  try {
    const config = await readGlobalConfig();
    if (config.apiUrl) return config.apiUrl;
  } catch {}
  return process.env.API_URL || "http://localhost:8000";
}

type PushResult = {
  success: boolean;
  commitId?: string;
  error?: string;
  skipped?: boolean;
};

async function pushCommit(
  repoId: string,
  token: string,
  apiBase: string,
  branch: string,
  commitId: string,
  commitDir: string,
  parentCommitId?: string,
): Promise<PushResult> {
  try {
    const metaPath = path.join(commitDir, "commits.json");
    let message = `Commit ${commitId}`;
    try {
      const meta = JSON.parse(await fs.readFile(metaPath, "utf-8"));
      message = meta.commitMessage || message;
    } catch {
      // Use default message
    }

    const dir = await fs.readdir(commitDir);
    const files: { filename: string; content: string }[] = [];

    for (const file of dir) {
      if (file === "commits.json") continue;
      const filePath = path.join(commitDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      files.push({ filename: file, content });
    }

    if (files.length === 0) {
      return { success: false, skipped: true, error: "No files in commit" };
    }

    const res = await fetch(`${apiBase}/repo/${repoId}/commits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        branch,
        message,
        parentCommitId,
        files,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ msg: res.statusText }));
      const errMsg = (errBody as Record<string, unknown>).msg || res.statusText;
      return { success: false, error: String(errMsg) };
    }

    const data = (await res.json()) as Record<string, unknown>;
    const commitData = data.commit as Record<string, unknown> | undefined;
    const result: PushResult = { success: true };
    if (commitData?.id) {
      result.commitId = String(commitData.id);
    }
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}

export default async function pushChanges(): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const configPath = path.join(repoPath, "config.json");
  const commitsPath = path.join(repoPath, "commits");

  try {
    let config: Record<string, any>;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch {
      console.log("Error: Not a CodeSync repository. Run 'codesync init <repoId>' first.");
      return;
    }

    let repoId = config.repoId;
    let token = config.token;

    if (!token) {
      const globalConfig = await readGlobalConfig();
      token = globalConfig.token;
    }

    if (!repoId) {
      console.log("Error: No remote set. Run 'codesync remote <repoId>' to link a CodeSync repo.");
      return;
    }
    if (!token) {
      console.log("Error: Not logged in. Run 'codesync login <token>' first.");
      return;
    }

    let commitDirs: string[];
    try {
      commitDirs = await fs.readdir(commitsPath);
    } catch {
      console.log("No commits to push.");
      return;
    }

    if (commitDirs.length === 0) {
      console.log("No commits to push.");
      return;
    }

    commitDirs.sort();

    console.log(`Pushing ${commitDirs.length} commit(s) to CodeSync...`);

    const branchName = config.branch || "main";
    const apiBase = await getApiBase();

    let lastCommitId: string | undefined;
    let pushed = 0;
    let errors = 0;

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);
      if (!stat.isDirectory()) continue;

      process.stdout.write(`  ↻ Commit ${commitDir.slice(0, 8)}... `);

      const result = await pushCommit(repoId, token, apiBase, branchName, commitDir, commitPath, lastCommitId);

      if (result.success) {
        lastCommitId = result.commitId;
        pushed++;
        console.log(`✓ (${result.commitId?.slice(0, 8)})`);
      } else if (result.skipped) {
        console.log(`⚠ skipped (no files)`);
      } else {
        errors++;
        console.log(`✗ ${result.error}`);
      }
    }

    if (errors > 0) {
      console.log(`\n⚠ Push completed with ${errors} error(s). ${pushed} commit(s) pushed successfully.`);
    } else {
      console.log(`\n✓ All commits pushed successfully! (${pushed} commit(s))`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error pushing changes: ${msg}`);
  }
}
