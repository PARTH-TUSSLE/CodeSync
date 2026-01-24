import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION!,
});

export const s3 = new AWS.S3();
export const S3_BUCKET = process.env.S3_BUCKET!;
