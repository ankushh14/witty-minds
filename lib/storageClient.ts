import { Storage, StorageOptions } from "@google-cloud/storage";

const storageOptions: StorageOptions = {
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
};

const bucketName = process.env.BUCKET_NAME;

const storage = new Storage(storageOptions);
const bucket = storage.bucket(bucketName!);

export { bucket };
