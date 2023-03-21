const express = require('express');
const {body} = require('express-validator');
const cors = require('cors');

const Collector = require('../../models/collector');
const authController = require('../../controllers/auth.controller');
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

//create a new Collector
router.post('/signup', [
    body('mobile')
        .trim()
        .isLength({min: 10, max: 10})
        .withMessage('Please enter a valid phone.')
        .custom((value, {req}) => {
            return Collector.findOne({ where: { mobile: value, status: 1 } })
                .then(CollectorDoc => {
                    if (CollectorDoc) {
                        return Promise.reject('Phone already exists');
                    }
                })
        }),
    body('password')
        .trim()
        .isLength({min: 8}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

//Verify OTP
router.post('/signup/verify', authController.verifyOtp);

//Refresh OTP
router.post('/signup/refreshOTP', authController.refreshOtp);

//Login a Collector
router.post('/login',[
    body('mobile')
        .trim()
        .isLength({min: 10, max: 10})
        .withMessage('Please enter a valid phone.'),
    body('password')
        .trim()
        .isLength({min: 8})
], authController.login);

router.post('/logout', authController.logout);

router.get('/collector', isAuth, authController.getCollector);

router.put('/collector/modify', isAuth, authController.changeData);

router.post('/refresh', authController.refresh);

module.exports = router;
