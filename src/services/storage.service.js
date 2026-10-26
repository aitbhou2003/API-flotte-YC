const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.MINIO_BUCKET_NAME || "fleettrack-documents";

const s3ClientInternal = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://minio:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "minioadmin",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin123",
  },
  forcePathStyle: true,
});

const s3ClientPublic = new S3Client({
  endpoint: process.env.MINIO_PUBLIC_ENDPOINT || "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "minioadmin",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin123",
  },
  forcePathStyle: true,
});


const initBucket = async () => {
  try {
    await s3ClientInternal.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      await s3ClientInternal.send(
        new CreateBucketCommand({ Bucket: bucketName }),
      );
      console.log(`✅ Bucket MinIO "${bucketName}" créé avec succès.`);
    }
  }
};

initBucket();


exports.uploadFile = async (buffer, s3Key) => {
  await initBucket();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: buffer,
    ContentType: "application/pdf",
  });

  await s3ClientInternal.send(command);
  return { bucket: bucketName, s3Key, sizeBytes: buffer.length };
};


exports.getPresignedUrl = async (s3Key) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3ClientPublic, command, { expiresIn: 900 });
  return url;
};
