import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";
import { useState } from "react";

const s3 = new S3Client({
  region: import.meta.env.VITE_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
  },
});

const bucketName = import.meta.env.VITE_BUCKET_NAME;

// Helper function to modify the file name
function getModifiedFileName(fileName) {
  const timestamp = Date.now();
  const extension = fileName.substring(fileName.lastIndexOf("."));
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
  return `${nameWithoutExt}-${timestamp}${extension}`; // Example: "file-1632567890123.png"
}

export function useS3Upload() {
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;

    const modifiedFileName = getModifiedFileName(file.name);
    const params = {
      Bucket: bucketName,
      Key: modifiedFileName,
      Body: file,
      ContentType: file.type,
    };

    const upload = new Upload({
      client: s3,
      params,
      leavePartsOnError: false,
    });
    upload.on("httpUploadProgress", (progress) => {
      if (progress) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);

        setProgress(percentage);
      }
    });
    try {
      await upload.done();
      setUploadedUrl(
        `https://${bucketName}.s3.${
          import.meta.env.VITE_REGION
        }.amazonaws.com/${modifiedFileName}`
      );
      setError(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("File upload failed. Please try again.");
    }
  };

  return {
    progress,
    uploadedUrl,
    error,
    uploadFile,
  };
}
