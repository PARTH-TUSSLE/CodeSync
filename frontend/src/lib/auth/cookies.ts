import { cookies } from "next/headers";

export const TOKEN_COOKIE = "codesync_token";

export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}
