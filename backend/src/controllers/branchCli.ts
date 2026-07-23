import { promises as fs } from "fs";
import path from "path";

export default async function createBranchCLI(branchName: string): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");

  try {
    const configPath = path.join(repoPath, "config.json");
    let config: Record<string, any>;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch {
      console.log("Error: Not a CodeSync repository. Run 'codesync init' first.");
      return;
    }

    const branchDir = path.join(repoPath, "branches");
    await fs.mkdir(branchDir, { recursive: true });

    const currentBranch = config.branch || "main";

    const branchFilePath = path.join(branchDir, `${branchName}.json`);
    try {
      await fs.access(branchFilePath);
      console.log(`Error: Branch '${branchName}' already exists.`);
      return;
    } catch {
      // Branch doesn't exist, safe to create
    }

    const defaultBranchPath = path.join(branchDir, `${currentBranch}.json`);
    let sourceCommitId: string | null = null;
    try {
      const currentBranchData = JSON.parse(await fs.readFile(defaultBranchPath, "utf-8"));
      sourceCommitId = currentBranchData.latestCommit || null;
    } catch {
      // No source branch info
    }

    await fs.writeFile(
      branchFilePath,
      JSON.stringify({ name: branchName, latestCommit: sourceCommitId, createdAt: new Date().toISOString() }, null, 2),
    );

    config.branch = branchName;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log(`✓ Switched to new branch '${branchName}'`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error creating branch: ${msg}`);
  }
}

export async function checkoutBranch(branchName: string): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");

  try {
    const configPath = path.join(repoPath, "config.json");
    let config: Record<string, any>;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch {
      console.log("Error: Not a CodeSync repository. Run 'codesync init' first.");
      return;
    }

    const branchDir = path.join(repoPath, "branches");
    const branchFilePath = path.join(branchDir, `${branchName}.json`);

    try {
      await fs.access(branchFilePath);
    } catch {
      console.log(`Error: Branch '${branchName}' does not exist.`);
      return;
    }

    config.branch = branchName;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log(`✓ Switched to branch '${branchName}'`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error switching branch: ${msg}`);
  }
}

export async function listBranches(): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".codesync");

  try {
    const branchDir = path.join(repoPath, "branches");
    let branchFiles: string[];
    try {
      branchFiles = await fs.readdir(branchDir);
    } catch {
      console.log("No branches found. Currently on 'main'.");
      return;
    }

    const configPath = path.join(repoPath, "config.json");
    let currentBranch = "main";
    try {
      const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
      currentBranch = config.branch || "main";
    } catch {
      // Use default
    }

    console.log("Branches:");
    for (const file of branchFiles) {
      if (!file.endsWith(".json")) continue;
      const name = file.replace(".json", "");
      const isCurrent = name === currentBranch;
      console.log(`  ${isCurrent ? "*" : " "} ${name}`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error listing branches: ${msg}`);
  }
}
