import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly client: S3Client | null = null;
  private readonly bucket: string;
  private readonly region: string;
  private readonly enabled: boolean;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.enabled = !!(
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
    );

    if (this.enabled) {
      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    if (!this.client || !this.bucket) {
      throw new Error('S3 is not configured');
    }

    const key = `covers/${filename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // No ACL - use bucket policy for public read (required when ACLs are disabled)
      }),
    );

    // Public URL: https://bucket.s3.region.amazonaws.com/key
    // Or with custom domain / CloudFront
    const baseUrl =
      process.env.AWS_S3_PUBLIC_URL ||
      `https://${this.bucket}.s3.${this.region}.amazonaws.com`;

    return `${baseUrl.replace(/\/$/, '')}/${key}`;
  }

  async uploadAudio(
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    if (!this.client || !this.bucket) {
      throw new Error('S3 is not configured');
    }

    const key = `audio/${filename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // No ACL - use bucket policy for public read (required when ACLs are disabled)
      }),
    );

    const baseUrl =
      process.env.AWS_S3_PUBLIC_URL ||
      `https://${this.bucket}.s3.${this.region}.amazonaws.com`;

    return `${baseUrl.replace(/\/$/, '')}/${key}`;
  }

  async deleteImage(key: string): Promise<void> {
    if (!this.client || !this.bucket) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
