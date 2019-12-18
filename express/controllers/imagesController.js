const Image = require('../models/imageModel');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');
const path = require('path');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'file-uploader-67d13.appspot.com'
});

const bucket = admin.storage().bucket();

exports.getAllImages = async (req, res) => {
    let images = await Image.find();

    res.json({
        status: 'success',
        data: images
    });
};

exports.uploadNewImage = async (req, res) => {
    let file = req.file;
    let newFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    try {
        const response = await uploadFile(file, newFileName);
        const metadata = await response.getMetadata();
        const cloudstorage_url = metadata[0].mediaLink;
        const firebase_url = cloudstorage_url.replace(
            'storage.googleapis.com/download/storage/v1',
            'firebasestorage.googleapis.com/v0'
        );
        const newImage = await Image.create({
            url: firebase_url
        });
        res.json({
            message: 'success',
            data: {
                newImage
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'error'
        });
    }
};

exports.download = async (req, res) => {
    // let filename = req.params.filename;
    // if (!filename) {
    //     res.status(500).json({
    //         message: 'error'
    //     });
    //     return;
    // }
    // const file = bucket.file(filename);
    // const fileStream = file.createReadStream();
    // fileStream.on('data', chunk => {
    //     res.write(chunk);
    // });
    // fileStream.on('end', () => {
    //     res.end();
    // });
    // fileStream.on('error', error => {
    //     console.log(error);
    //     res.status(500).json({
    //         message: 'error'
    //     });
    // });
};

const uploadFile = (file, newFileName) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                predefinedAcl: 'publicRead'
            }
        });

        blobStream.on('error', error => {
            reject(error);
        });

        blobStream.on('finish', () => {
            resolve(fileUpload);
        });

        blobStream.end(file.buffer);
    });
};

// exports.upload = async (req, res) => {
//     let file = req.file;
//     try {
//         await uploadFile(file);
//         res.json({
//             message: 'success'
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'error'
//         });
//     }
// };

// exports.createImage = async (req, res) => {
//     if (req.body.url) {
//         const newImage = await Image.create(req.body);

//         res.status(201).json({
//             status: 'success',
//             data: newImage
//         });
//     } else {
//         res.status(400).json({
//             status: 'bad request',
//             message: 'please insert author and message as body fields'
//         });
//     }
// };
