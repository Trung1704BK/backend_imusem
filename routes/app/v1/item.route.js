
const express = require('express');
const router = express.Router();
const itemController = require('../../../controllers/app/item.controller');

//List a specific item with all information
router.get('/:id', itemController.getItemById);


module.exports = router;
