/**
 * Helper script to get the CLI login command
 * Add this to your profile page or a settings page
 */

export function getCliLoginCommand(): string {
  const token = localStorage.getItem("token");

  if (!token) {
    return "Please log in first";
  }

  return `npm run dev login ${token}`;
}

export function copyCliLoginCommand(): boolean {
  const command = getCliLoginCommand();

  if (command === "Please log in first") {
    return false;
  }

  try {
    navigator.clipboard.writeText(command);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}
