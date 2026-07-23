import { promises as fs } from "fs";
import path from "path";
import { readGlobalConfig } from "../utils/globalConfig.js";

export async function setRemote(repoId: string): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");
  const configPath = path.join(repoPath, "config.json");

  try {
    await fs.mkdir(repoPath, { recursive: true });

    let config: Record<string, any> = {};
    try {
      const existing = await fs.readFile(configPath, "utf-8");
      config = JSON.parse(existing);
    } catch {
      // No existing config
    }

    const globalConfig = await readGlobalConfig();
    config.repoId = repoId;
    config.token = globalConfig.token;
    config.bucket = process.env.S3_BUCKET;

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log(`✓ Remote set to CodeSync repo: ${repoId}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error setting remote: ${msg}`);
  }
}

export async function showRemote(): Promise<void> {
  const configPath = path.resolve(process.cwd(), ".codesync", "config.json");

  try {
    const content = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(content);
    if (config.repoId) {
      console.log(`Remote CodeSync repo: ${config.repoId}`);
    } else {
      console.log("No remote set. Run: codesync remote <repoId>");
    }
  } catch {
    console.log("Not a CodeSync repository (no .codesync directory)");
  }
}
