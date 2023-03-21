const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

const collectionRoutes = require('./collection.route');
const itemRoutes = require('./item.route');

router.use('/collections', collectionRoutes);

router.use('/items', itemRoutes);

router.get('/permanent_exhibit', (req, res, next) => {
    fs.readFile(path.join(__dirname, '..', '..', '..', 'trung_bay_thuong_xuyen.txt'), 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).json({
                result: false,
                errorCode: 1
            });
        }
        res.status(200).json(JSON.parse(data));
    });
});

module.exports = router;
