import { promises as fs } from "fs";
import path from "path";
import { cwd } from "process";
import { readGlobalConfig } from "../utils/globalConfig.js";

async function getApiBase(): Promise<string> {
  try {
    const config = await readGlobalConfig();
    if (config.apiUrl) return config.apiUrl;
  } catch {}
  return process.env.API_URL || "http://localhost:8000";
}

export default async function pullChanges(): Promise<void> {
  const repoPath = path.resolve(cwd(), ".codesync");
  const configPath = path.join(repoPath, "config.json");

  try {
    let config: Record<string, any>;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch {
      console.log("Error: Not a CodeSync repository. Run 'codesync init <repoId>' first.");
      return;
    }

    const repoId = config.repoId;
    const token = config.token;

    if (!repoId) {
      console.log("Error: No remote set. Run 'codesync remote <repoId>'.");
      return;
    }
    if (!token) {
      console.log("Error: Not logged in. Run 'codesync login <token>' first.");
      return;
    }

    const apiBase = await getApiBase();
    const branchName = config.branch || "main";

    console.log(`Pulling latest files from ${branchName}...`);

    const res = await fetch(`${apiBase}/repo/${repoId}/branch/${branchName}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ msg: res.statusText }));
      console.log(`Error: ${(errBody as Record<string, unknown>).msg || res.statusText}`);
      return;
    }

    const data = (await res.json()) as Record<string, any>;
    const files = data.files as Array<{ filename: string; content: string }> | undefined;

    if (!files || files.length === 0) {
      console.log("No files found on remote.");
      return;
    }

    const parentDir = path.resolve(repoPath, "..");
    let count = 0;

    for (const file of files) {
      const filePath = path.join(parentDir, file.filename);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content, "utf-8");
      count++;
    }

    console.log(`✓ Pulled ${count} file(s) from ${branchName}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error pulling changes: ${msg}`);
  }
}
