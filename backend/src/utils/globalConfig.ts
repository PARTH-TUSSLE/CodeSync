import { promises as fs } from "fs";
import path from "path";
import os from "os";
import jwt from "jsonwebtoken";

interface GlobalConfig {
  token?: string;
  userId?: string;
  apiUrl?: string;
}

/**
 * Get the global config directory path
 * Similar to how Git stores config in ~/.gitconfig
 */
function getGlobalConfigDir(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".codesync");
}

function getGlobalConfigPath(): string {
  return path.join(getGlobalConfigDir(), "config.json");
}

/**
 * Read the global configuration
 */
export async function readGlobalConfig(): Promise<GlobalConfig> {
  try {
    const configPath = getGlobalConfigPath();
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {}; // Return empty if file doesn't exist
  }
}

/**
 * Write to the global configuration
 */
export async function writeGlobalConfig(config: GlobalConfig): Promise<void> {
  try {
    const configDir = getGlobalConfigDir();
    const configPath = getGlobalConfigPath();

    // Create directory if it doesn't exist
    await fs.mkdir(configDir, { recursive: true });

    // Write config
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error writing global config:", error);
  }
}

/**
 * Get userId from stored token
 * Decodes JWT to extract user ID
 */
export async function getUserIdFromToken(): Promise<string | null> {
  try {
    const config = await readGlobalConfig();

    // First check if userId is directly stored
    if (config.userId) {
      return config.userId;
    }

    // Otherwise, try to decode token
    if (config.token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.log("Warning: JWT_SECRET not configured");
        return null;
      }

      const decoded = jwt.verify(config.token, jwtSecret) as any;
      return decoded.id || null;
    }

    return null;
  } catch (error) {
    console.log("Warning: Could not get user ID from token");
    return null;
  }
}

/**
 * Login command - stores token for future CLI usage
 */
export async function loginUser(token: string, apiUrlInput?: string): Promise<void> {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.log("Error: JWT_SECRET not configured");
    return;
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, jwtSecret) as any;
    const userId = decoded.id;

    const apiUrl = apiUrlInput || process.env.API_URL || "http://localhost:8000";

    // Store both token and userId
    await writeGlobalConfig({ token, userId, apiUrl });

    console.log("✓ Successfully logged in!");
    console.log(`✓ API URL: ${apiUrl}`);
    console.log(
      "You can now use CodeSync CLI commands from any directory.",
    );
  } catch (error) {
    console.log("Error: Invalid token");
  }
}

/**
 * Logout command - removes stored credentials
 */
export async function logoutUser(): Promise<void> {
  await writeGlobalConfig({});
  console.log("✓ Successfully logged out!");
}
