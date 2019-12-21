const express = require('express');
const imagesController = require('../controllers/imagesController');
const multer = require('multer');

const router = express.Router();

// Initialize Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router
    .route('/')
    .get(imagesController.getAllImages)
    .post(upload.single('file'), imagesController.uploadNewImage);

router.route('/:filename').delete(imagesController.deleteImage);

module.exports = router;
