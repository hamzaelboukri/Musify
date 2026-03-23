import { describe, it, expect } from 'vitest';
import { getCoverImageUrl } from './coverImage';

describe('getCoverImageUrl', () => {
  it('returns placeholder when url is empty', () => {
    expect(getCoverImageUrl(undefined)).toBe('/placeholder.svg');
    expect(getCoverImageUrl('')).toBe('/placeholder.svg');
  });

  it('returns gradient placeholder when seed provided without url', () => {
    const url = getCoverImageUrl(undefined, 'my-seed');
    expect(url.startsWith('data:image/svg+xml')).toBe(true);
  });

  it('returns S3 URLs as-is', () => {
    const s3 = 'https://bucket.s3.us-east-1.amazonaws.com/audio/x.mp3';
    expect(getCoverImageUrl(s3)).toBe(s3);
  });

  it('returns CloudFront URLs as-is', () => {
    const cf = 'https://d123.cloudfront.net/cover.jpg';
    expect(getCoverImageUrl(cf)).toBe(cf);
  });

  it('extracts /uploads/ path from full URL', () => {
    expect(getCoverImageUrl('http://localhost:3001/uploads/images/a.jpg')).toBe('/uploads/images/a.jpg');
  });

  it('normalizes uploads/ prefix', () => {
    expect(getCoverImageUrl('uploads/audio/x.mp3')).toBe('/uploads/audio/x.mp3');
  });
});
