import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client | null = null;
  private bucketName: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>("R2_ACCOUNT_ID");
    const accessKeyId = this.configService.get<string>("R2_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>("R2_SECRET_ACCESS_KEY");
    this.bucketName =
      this.configService.get<string>("R2_BUCKET_NAME") || "codexa-uploads";
    this.publicUrl = this.configService.get<string>("R2_PUBLIC_URL") || "";

    if (accountId && accessKeyId && secretAccessKey) {
      this.client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log("Cloudflare R2 storage client configured");
    } else {
      this.logger.warn(
        "R2 credentials not provided in .env — storage service is running in local fallback mode",
      );
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
  ): Promise<UploadResult> {
    if (!this.client) {
      this.logger.warn(`Storage mock: simulated upload for ${key}`);
      return {
        key,
        url: this.publicUrl ? `${this.publicUrl}/${key}` : `/uploads/${key}`,
        bucket: this.bucketName,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.client.send(command);

    const fileUrl = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : await this.getPresignedDownloadUrl(key, 3600);

    return {
      key,
      url: fileUrl,
      bucket: this.bucketName,
    };
  }

  async getPresignedDownloadUrl(
    key: string,
    expiresInSeconds: number = 3600,
  ): Promise<string> {
    if (!this.client) {
      return this.publicUrl ? `${this.publicUrl}/${key}` : `/uploads/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async deleteFile(key: string): Promise<boolean> {
    if (!this.client) {
      this.logger.warn(`Storage mock: simulated delete for ${key}`);
      return true;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
    return true;
  }
}
