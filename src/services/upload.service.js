const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

async function uploadFileToS3(fileBuffer, mimeType) {
  const fileName = generateFileName();
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimeType,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

module.exports = { uploadFileToS3 };
