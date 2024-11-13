import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Helper function to delete an existing file
export const deleteExistingFile = async (fileKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

export async function uploadFile(file, fileNameWithFolder, fileKey = null) {
  if (!file) return;

  if (file.size > 300 * 1024) {
    throw new Error("Max file size: 300 KB");
  }

  if (fileKey) {
    await deleteExistingFile(fileKey);
  }
  // Generate a unique filename

  // Read the file as a stream
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileNameWithFolder,
    ContentType: file.mimetype,
  };

  const res = await s3Client.send(new PutObjectCommand(uploadParams));
  return res;
}

export async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 1800;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}
