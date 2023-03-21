const express = require('express');

const router = express.Router();

const isAuth = require("../../middleware/is-auth");
const authRoutes = require('./auth.route');
const itemRoutes = require('./item.route');

router.use('/auth', authRoutes);

router.use('/items', isAuth, itemRoutes);

module.exports = router;
