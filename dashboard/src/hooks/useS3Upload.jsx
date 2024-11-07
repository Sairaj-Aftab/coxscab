import {
  S3Client,
  //   PutObjectCommand,
  //   GetObjectCommand,
  DeleteObjectCommand,
  //   ListObjectsV2Command,
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
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to delete an existing file
  const deleteExistingFile = async (fileKey) => {
    try {
      const deleteParams = {
        Bucket: bucketName,
        Key: fileKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error("Error deleting existing file:", error);
    }
  };

  const uploadFile = async (file, deleteFile) => {
    if (!file) return;

    if (deleteFile) {
      const url = new URL(deleteFile);
      // Extract and return the pathname, removing the leading '/'
      const fileKey = url.pathname.substring(1);
      await deleteExistingFile(fileKey);
    }

    const modifiedFileName = getModifiedFileName(file.name);

    const params = {
      Bucket: bucketName,
      Key: `drivers/${modifiedFileName}`,
      Body: file,
      ContentType: file.type,
    };

    setImgLoading(true);
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
      setImgUrl(
        `https://${bucketName}.s3.${
          import.meta.env.VITE_REGION
        }.amazonaws.com/drivers/${modifiedFileName}`
      );
      setError(null);

      setImgLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("File upload failed. Please try again.");
      setImgLoading(false);
    }
  };

  return {
    progress,
    imgLoading,
    imgUrl,
    setImgUrl,
    error,
    uploadFile,
  };
}
