const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv');
dotenv.config({ path: "./config/.env" });
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

function uploadFile(fileBuffer, fileName, mimetype) {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype,
        ACL: 'public-read'
    };
    return s3Client.send(new PutObjectCommand(uploadParams));
}

function deleteFile(fileName) {
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
    };
    return s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function listAllFiles() {
    const listParams = {
        Bucket: bucketName,
    };
    const data = await s3Client.send(new ListObjectsV2Command(listParams));
    return data.Contents || [];
}

async function deleteFiles(fileKeys) {
    const deleteParams = {
        Bucket: bucketName,
        Delete: {
            Objects: fileKeys.map(key => ({ Key: key })),
        },
    };
    return s3Client.send(new DeleteObjectsCommand(deleteParams));
}

function getObjectUrl(key) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

async function getObjectSignedUrl(key) {
    const params = {
        Bucket: bucketName,
        Key: key
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command);
    return url;
}

module.exports = {
    uploadFile,
    deleteFile,
    getObjectUrl,
    getObjectSignedUrl,
    deleteFiles,
    listAllFiles
};
