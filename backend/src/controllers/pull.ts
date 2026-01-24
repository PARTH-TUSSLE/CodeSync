import { promises as fs, createWriteStream } from "fs";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { cwd } from "process";
import { promisify } from "util";
import { pipeline as pipelineCallback } from "stream";
const pipeline = promisify(pipelineCallback);

export default async function pullChanges(): Promise<any> {
  const repoPath = path.resolve(cwd(), ".codesync");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" })
      .promise();

    const objects = data.Contents;

    if (objects) {
      for (const object of objects) {
        const key = object.Key;
        if (!key) {
          console.log(`key not found in S3 bucket`);
          continue;
        }
        const lastSegment = path.dirname(key).split("/").pop() || "";
        const commitDir = path.join(commitsPath, lastSegment);

        await fs.mkdir(commitDir, { recursive: true });

        const params = {
          Bucket: S3_BUCKET,
          Key: key,
        };

        const fileContent = await s3.getObject(params).promise();
        const body = fileContent.Body;

        if (!body) {
          console.log(`Empty body for key ${key}`);
          continue;
        }

        const filePath = path.join(repoPath, key);

        // Buffer or Uint8Array
        if (body instanceof Buffer || body instanceof Uint8Array) {
          await fs.writeFile(filePath, Buffer.from(body));
        }
        // string
        else if (typeof body === "string") {
          await fs.writeFile(filePath, body);
        }
        // stream (Node Readable)
        else if (typeof (body as any)?.pipe === "function") {
          const writeStream = createWriteStream(filePath);
          await pipeline(body as NodeJS.ReadableStream, writeStream);
        }
        // Blob-like (has arrayBuffer)
        else if (body && typeof (body as any).arrayBuffer === "function") {
          const ab = await (body as any).arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(ab));
        }
        // fallback to string coercion
        else {
          await fs.writeFile(filePath, String(body));
        }

        console.log(`All commits pulled from the repository !`)

      }
    } else {
      console.log(`Error pulling the changes`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        `Error while pulling the recent commits from the repository : ${error.message}`,
      );
    } else {
      console.log(
        `Error while pulling the recent commits from the repository : ${error}`,
      );
    }
  }
}
