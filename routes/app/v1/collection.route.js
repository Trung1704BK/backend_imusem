const express = require('express');

const router = express.Router();

const collectionController = require('../../../controllers/app/collection.controller');

//List all collections with all items
router.get('/', collectionController.getCollections);

//List a specific collection with all items
router.get('/:id', collectionController.getCollectionById);

module.exports = router;
