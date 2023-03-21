const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


//Sequelize models
const sequelize = require('./util/database');
const Collector = require('./models/collector');
const Collection = require('./models/collection');
const ItemCollection = require('./models/itemCollection');
const Token = require('./models/token');
const Item = require('./models/item');
const Image = require('./models/image');
const Age = require('./models/age');
const Material = require('./models/material');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});

app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json()); // application/json
app.use(cookieParser());
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).array('image'));
app.use('/images',express.static(path.join(__dirname, 'images')));

const whiteList = [
    'http://localhost:3000',
    'http://ihr.ddns.net'
];

//CORS
app.use(cors({
    origin: whiteList,
    credentials: true
}));

const v1Routes = require('./routes/v1/index');
const appRoutes = require('./routes/app/index');

app.use('/v1', v1Routes);
app.use('/app', appRoutes);


//Error handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    });
})

//Set relationships
Collector.hasOne(Token, {
    foreignKey: "collectorId"
});
Collector.hasMany(Item, {
    foreignKey: "collector_id"
});
Collector.hasMany(Collection, {
    foreignKey: "collectorId"
});

Collection.belongsTo(Collector, {
    foreignKey: "collectorId"
});

Item.belongsTo(Collector, {
    foreignKey: "collector_id"
});
Item.hasMany(Image, {
    foreignKey: "itemId"
});
Item.belongsTo(Age, {
    foreignKey: 'ageId'
})
Item.belongsTo(Material, {
    foreignKey: 'materialId'
})

Item.belongsToMany(Collection, {through: ItemCollection, foreignKey: 'itemId'});
Collection.belongsToMany(Item, {through: ItemCollection, foreignKey: 'collectionId'});

//Set connect
sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`App running on port ${process.env.PORT || 8080}!`)
        })
    })
    .catch(err => {
        console.log(err);
    })


