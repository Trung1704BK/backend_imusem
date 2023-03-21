const {S3} = require('aws-sdk');
const {v4: uuidv4} = require("uuid");
const path = require("path");

exports.s3Upload = async (pathSaveFiles, files) => {
    const s3 = new S3();


    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${pathSaveFiles}/${uuidv4() + path.extname(file.originalname)}`,
            Body: file.buffer
        }
    })

    return await Promise.all(params.map(param => s3.upload(param).promise()))
};
