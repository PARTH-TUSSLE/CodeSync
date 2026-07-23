import { marked } from "marked";

export async function markdown(text: string): Promise<string> {
  const result = await marked.parse(text, {
    gfm: true,
    breaks: true,
  });
  return result;
}
