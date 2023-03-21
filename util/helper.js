const path = require('path');
const fs = require('fs');

const {v4: uuidv4 } = require('uuid');
const multer = require("multer");
const sharp = require("sharp");
const {S3} = require("aws-sdk");

exports.clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};

exports.configStorage = (pathToStoreFiles) => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pathToStoreFiles);
        },
        filename: (req, file, cb) => {
            cb(null, uuidv4() + path.extname(file.originalname));
        }
    });
    return fileStorage;
}

exports.configFilterFileUpload = () => {
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
    return fileFilter;
};

exports.renderImage = async (path, file, type, size) => {
    const pathKey = path.replace('original', type);
    return sharp(file.buffer)
            .resize(size, null)
            .toBuffer((err, data, info) => {
                const s3 = new S3();

                const param = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: pathKey,
                    Body: data
                }
                s3.upload(param).promise()
            })
};



