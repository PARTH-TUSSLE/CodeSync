import { promises as fs } from "fs";
import path from "path";
import os from "os";
import jwt from "jsonwebtoken";
import { spawn } from "child_process";

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
 * Open a URL in the user's default browser
 */
function openBrowser(url: string): void {
  const platform = process.platform;
  let command: string;
  let args: string[];

  if (platform === "win32") {
    command = "cmd";
    args = ["/c", "start", "", url];
  } else if (platform === "darwin") {
    command = "open";
    args = [url];
  } else {
    command = "xdg-open";
    args = [url];
  }

  try {
    const child = spawn(command, args, { stdio: "ignore", detached: true });
    child.unref();
  } catch {
    // Ignore — the URL is still printed to the terminal
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Device flow login — pairs this machine with the web app with a single click.
 * The CLI opens a browser where the already-logged-in user authorizes the
 * device; the long-lived CLI token is delivered back via polling.
 */
export async function deviceLogin(
  apiUrlInput?: string,
  webUrlInput?: string,
): Promise<void> {
  const apiBase = apiUrlInput || process.env.API_URL || "http://localhost:8000";
  const webBase = webUrlInput || process.env.WEB_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${apiBase}/auth/device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiUrl: apiBase }),
    });

    if (!res.ok) {
      console.log(`Error: Could not reach the CodeSync API at ${apiBase} (${res.status})`);
      console.log("Make sure the backend server is running, or pass --api-url.");
      return;
    }

    const data = (await res.json()) as {
      deviceCode?: string;
      userCode?: string;
      expiresIn?: number;
    };
    const deviceCode = data.deviceCode;
    const userCode = data.userCode;
    const expiresIn = data.expiresIn ?? 10 * 60 * 1000;

    if (!deviceCode || !userCode) {
      console.log("Error: Unexpected response from the server.");
      return;
    }

    const verifyUrl = `${webBase}/cli/authorize?code=${userCode}`;

    console.log("To log in, authorize this device in your browser:");
    console.log("");
    console.log(`  ${verifyUrl}`);
    console.log("");
    console.log(`Your code: ${userCode}`);
    console.log("Waiting for authorization... (Ctrl+C to cancel)");
    console.log("");

    openBrowser(verifyUrl);

    const deadline = Date.now() + expiresIn;
    while (Date.now() < deadline) {
      await sleep(2000);
      try {
        const statusRes = await fetch(
          `${apiBase}/auth/device/status?deviceCode=${encodeURIComponent(deviceCode)}`,
        );
        if (!statusRes.ok) continue;
        const status = (await statusRes.json()) as {
          status?: string;
          token?: string;
          userId?: string;
        };
        if (status.status === "authorized" && status.token) {
          const config: GlobalConfig = {
            token: status.token,
            apiUrl: apiBase,
          };
          if (status.userId) {
            config.userId = status.userId;
          }
          await writeGlobalConfig(config);
          console.log("✓ Successfully logged in!");
          console.log("You can now use CodeSync CLI commands from any directory.");
          return;
        }
        if (status.status === "expired") {
          console.log("Error: This code has expired. Run 'codesync login' to try again.");
          return;
        }
      } catch {
        // Backend temporarily unreachable — keep polling
      }
    }

    console.log("Error: Authorization timed out. Run 'codesync login' to try again.");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error during login: ${msg}`);
  }
}

/**
 * Logout command - removes stored credentials
 */
export async function logoutUser(): Promise<void> {
  await writeGlobalConfig({});
  console.log("✓ Successfully logged out!");
}
