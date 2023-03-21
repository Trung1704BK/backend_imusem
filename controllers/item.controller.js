const Item = require('../models/item');
const Image = require('../models/image');
const Collector = require('../models/collector');
const Age = require('../models/age');
const Material = require('../models/material');

//Get all items by collector
exports.getItems = async (req, res, next) => {
  console.log('collectorID', req.collectorId);
  try {
    let items = await Item.findAll({
      where: {
        collector_id: req.collectorId,
      },
      include: [
        {
          model: Image,
          attributes: [['name', 'url']],
        },
        {
          model: Age,
          attributes: ['name'],
        },
        {
          model: Material,
          attributes: ['name'],
        },
        {
          model: Collector,
          attributes: ['full_name'],
        },
      ],
    });
    if (items.length > 0) {
      items = JSON.parse(JSON.stringify(items));
      items.forEach((item) => {
        item.feature_image = process.env.MEDIA_HOST + item.feature_image;
        item.images.forEach((image) => {
          image.url = process.env.MEDIA_HOST + image.url;
        });
      });
      res.status(200).json({
        result: true,
        items: items,
      });
    } else {
      console.log('hi');
      res.status(404).json({
        result: false,
        errorCode: 1,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get item by id
exports.getItem = async (req, res, next) => {
  const id = req.params.id;
  try {
    let item = await Item.findOne({
      where: {
        collector_id: req.collectorId,
        item_id: id,
      },
      include: [
        {
          model: Image,
          attributes: [['name', 'url']],
        },
        {
          model: Age,
          attributes: ['name'],
        },
        {
          model: Material,
          attributes: ['name'],
        },
        {
          model: Collector,
          attributes: ['full_name'],
        },
      ],
    });

    if (item) {
      item = JSON.parse(JSON.stringify(item));
      console.log(item);
      item.images.forEach((image) => {
        image.url = process.env.MEDIA_HOST + image.url;
      });
      res.status(200).json({
        result: true,
        item: item,
      });
    } else {
      res.status(404).json({
        result: false,
        errorCode: 1,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Create a new item
exports.createItem = async (req, res, next) => {
  try {
    const {
      name,
      ownerType,
      materialId,
      original,
      ageId,
      itemType,
      dimension,
      weight,
      description,
      audio,
      collected_date,
    } = req.body;

    if (!name) {
      const error = new Error('Tên vật phẩm không được để trống!');
      error.statusCode = 422;
      throw error;
    }

    const imageUrls = [];

    if (res.locals.resultsImages) {
      res.locals.resultsImages.forEach((file) => {
        imageUrls.push(file.key);
      });
    }

    const item = await Item.create({
      name: name,
      collector_id: req.collectorId,
      ownerType: ownerType ? ownerType : null,
      materialId: materialId ? materialId : null,
      original: original ? original : null,
      ageId: ageId ? ageId : null,
      itemType: itemType ? itemType : null,
      dimension: dimension ? dimension : null,
      weight: weight ? weight : null,
      description: description ? description : null,
      audio: audio ? audio : null,
      collected_date: collected_date ? collected_date : null,
    });

    imageUrls.forEach((imageUrl) => {
      Image.create({
        itemId: item.getDataValue('item_id'),
        name: imageUrl,
      });
    });
    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
