const { S3Client, HeadObjectCommand, GetObjectTaggingCommand } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION || process.env.AWS_REGION_NAME || 'us-east-1';
const s3 = new S3Client({ region });

exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const size = record.s3.object.size;
    const eventTime = record.eventTime;
    const eventType = record.eventName;

    let contentType = 'unknown';
    let lastModified = null;
    let tags = [];
    try {
      const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      contentType = head.ContentType ?? 'unknown';
      lastModified = head.LastModified ?? null;
    } catch (err) {
      console.warn(`Não foi possível buscar metadados para ${key}:`, err.message);
    }
    try {
      const tagging = await s3.send(new GetObjectTaggingCommand({ Bucket: bucket, Key: key }));
      tags = (tagging.TagSet || []).map((t) => ({ key: t.Key, value: t.Value }));
    } catch (err) {
      console.warn(`Não foi possível buscar tags para ${key}:`, err.message);
    }

    const fileInfo = {
      eventType,
      eventTime,
      bucket,
      key,
      fileName: key.split('/').pop(),
      sizeBytes: size,
      sizeKB: (size / 1024).toFixed(2),
      contentType,
      lastModified,
      tags,
      region,
    };

    console.log('Arquivo detectado:', JSON.stringify(fileInfo, null, 2));
    results.push(fileInfo);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Monitoramento executado com sucesso.',
      processedFiles: results.length,
      files: results,
    }),
  };
};
