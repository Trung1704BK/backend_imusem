require('dotenv/config');
const Image = require("../../models/image");
const Age = require("../../models/age");
const Collector = require("../../models/collector");
const Material = require("../../models/material");
const Item = require('../../models/item');

const {MEDIA_HOST} = process.env;


exports.getItemById = async (req, res, next) => {
    const itemId = req.params.id;
    try {
        let item = await Item.findOne({
            where: {
                item_id: itemId,
                is_deleted: 0,
                status: 1
            },
            attributes: { exclude: ['materialId', 'ageId', 'collector_id', 'status'] },
            include: [
                {
                    model: Image,
                    attributes: [['name', 'url']]
                },
                {
                    model: Age,
                    attributes: ['name']
                },
                {
                    model: Material,
                    attributes: ['name']
                },
                {
                    model: Collector,
                    attributes: ['full_name']
                }
            ]
        });

        if (item) {
            item = JSON.parse(JSON.stringify(item));

            item.images.forEach(image => {
                image.url = MEDIA_HOST + image.url;
            });

            res.status(200).json({
                result: true,
                item: item
            });
        } else {
            res.status(404).json({
                result: false,
                errorCode: 1
            })
        }

    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
