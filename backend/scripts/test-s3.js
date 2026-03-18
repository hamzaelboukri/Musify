/**
 * Quick S3 connectivity test.
 * Run: node scripts/test-s3.js
 * (from backend folder, with .env loaded)
 */
require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

async function testS3() {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || 'eu-north-1';
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

  console.log('\n--- S3 Config Check ---');
  console.log('Bucket:', bucket || '(missing)');
  console.log('Region:', region);
  console.log('Access Key:', accessKey ? `${accessKey.slice(0, 8)}...` : '(missing)');
  console.log('Secret Key:', secretKey ? '***' : '(missing)');

  if (!bucket || !accessKey || !secretKey) {
    console.error('\n❌ Missing AWS env vars. Check .env');
    process.exit(1);
  }

  const client = new S3Client({
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });

  const testKey = `audio/test-${Date.now()}.txt`;
  const testBody = Buffer.from('Musify S3 test - you can delete this file');

  try {
    console.log('\n--- Upload Test ---');
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: testBody,
        ContentType: 'text/plain',
      })
    );
    console.log('✅ Upload OK');

    const url = `https://${bucket}.s3.${region}.amazonaws.com/${testKey}`;
    console.log('URL:', url);

    console.log('\n--- Get Test ---');
    const getRes = await client.send(new GetObjectCommand({ Bucket: bucket, Key: testKey }));
    const body = await getRes.Body?.transformToString();
    console.log('✅ Get OK, content:', body?.slice(0, 30) + '...');

    console.log('\n✅ S3 is working! Music uploads will go to S3.\n');
  } catch (err) {
    console.error('\n❌ S3 Error:', err.message);
    if (err.name === 'AccessDenied') console.error('   → Check IAM permissions (s3:PutObject, s3:GetObject)');
    if (err.name === 'NoSuchBucket') console.error('   → Bucket does not exist or wrong region');
    process.exit(1);
  }
}

testS3();
