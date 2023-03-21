const express = require('express');
const multer = require('multer');

const router = express.Router();

const itemController = require('../../controllers/item.controller');
const { configFilterFileUpload, renderImage } = require('../../util/helper');
const { s3Upload } = require('../../util/s3Service');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: configFilterFileUpload(),
});

//Get all items
router.get('/', itemController.getItems);

//Get item by id
router.get('/:id', itemController.getItem);

//Create new item
router.post(
  '/',
  upload.array('feature_image'),
  async (req, res, next) => {
    console.log(req.files);
    // try {
    //     const pathSaveFiles = `images/${req.collectorId}/items/original`;
    //     const results = await s3Upload(pathSaveFiles, req.files);
    //     res.locals.resultsImages = results;
    //     let index = 0;
    //     for (const file of req.files) {
    //         await Promise.all([
    //             renderImage(results[index].key, file, 'small', 360),
    //             renderImage(results[index].key, file, 'medium', 640),
    //             renderImage(results[index].key, file, 'large', 1280)
    //         ]);
    //         index++;
    //     }
    //     next();
    // }catch (err) {
    //     console.log(err);
    // }
    res.status(200).json({
      result: true,
    });
  },
  itemController.createItem
);

module.exports = router;
