require('dotenv/config');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

const Collector = require('../models/collector');
const Token = require('../models/token');
const {verify} = require("jsonwebtoken");
const {Op} = require("sequelize");

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const mobile = req.body.mobile;
        const name = req.body.name;
        const password = req.body.password;
        
        const hashedPw = await bcrypt.hash(password, 12);

        const OTP = otpGenerator.generate(4, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        console.log(OTP);

        const hashedOtp = await bcrypt.hash(OTP, 12);

        let otpExpiredTime = new Date();
        otpExpiredTime.setMinutes(otpExpiredTime.getMinutes() + 3);

        //Find if collector is existed but not activated
        const collector = await Collector.findOne({ where: {mobile: mobile }});

        // If found, update information, else create new collector (not activated)
        if (collector) {
            collector.full_name = name;
            collector.password = hashedPw;
            collector.otp = hashedOtp;
            collector.otp_expired = otpExpiredTime;
            collector.updatedAt = new Date().setHours(new Date().getHours() + 7);

            await collector.save();
        } else {
            await Collector.create({
                mobile: mobile,
                full_name: name,
                password: hashedPw,
                otp: hashedOtp,
                otp_expired: otpExpiredTime
            });
        }

        res.status(201).json({
            message: 'collector created!'
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const {mobile, otp} = req.body;

        const collector = await Collector.findOne({ where: { mobile: mobile, status: 0 } });

        //Cannot find unactivated collector with phone
        if (!collector) {
            const error = new Error("Cannot find the mobile to verify");
            error.statusCode = 404;
            throw error;
        }

        const isEqual = await bcrypt.compare(otp, collector.otp);

        //Compare OTP
        if (!isEqual) {
            const error = new Error('OTP không khớp.');
            error.statusCode = 401;
            throw error;
        }

        //Check otp expired time
        if (collector.otp_expired < new Date()) {
            const error = new Error('OTP đã hết hiệu lực.');
            error.statusCode = 403;
            throw error;
        }


        //Activate collector
        collector.status = 1;
        collector.otp = null;
        collector.otp_expired = null;
        collector.updatedAt = new Date();

        await collector.save();

        res.status(201).json({
            message: "created successfully!"
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.refreshOtp = async (req, res, next) => {
    try {
        const {mobile} = req.body;

        const collector = await Collector.findOne({ where: { mobile: mobile, status: 0 } });

        //Cannot find unactivated collector with phone
        if (!collector) {
            const error = new Error("Cannot find the mobile to verify");
            error.statusCode = 404;
            throw error;
        }

        const OTP = otpGenerator.generate(4, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });

        console.log(OTP);

        const hashedOtp = await bcrypt.hash(OTP, 12);

        let otpExpiredTime = new Date();
        otpExpiredTime.setMinutes(otpExpiredTime.getMinutes() + 3);

        collector.otp = hashedOtp;
        collector.otp_expired = otpExpiredTime;
        collector.updatedAt = new Date();

        await collector.save();

        res.status(200).json({
            message: 'Đã gửi mã thành công!'
        });

    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            throw error;
        }

        const mobile = req.body.mobile;
        const password = req.body.password;

        const collector = await Collector.findOne({ where: {mobile: mobile} });
        if (!collector) {
            const error = new Error('A collector with this phone could not be found.');
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, collector.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwt.sign({
            collectorId: collector.collector_id
            }, process.env.JWT_SECRET_KEY, {expiresIn: '1d'}
        );

        const refreshToken = jwt.sign({
            collectorId: collector.collector_id
        }, process.env.JWT_REFRESH_KEY, {expiresIn: '1w'});

        const expired_time = new Date();
        expired_time.setDate(expired_time.getDate() + 7);

        await Token.create({
            collectorId: collector.collector_id,
            token: refreshToken,
            expired_time: expired_time
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        })

        res.status(200).json({
            token: accessToken
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getCollector = async (req, res, next) => {
    try {
        const collector = await Collector.findByPk(req.collectorId);

        if (!collector) {
            const error = new Error('Không tìm thấy người dùng!');
            error.statusCode = 404;
            throw error;
        }
        const {password, otp, otp_expired, status, createdAt, updatedAt, ..._collector} = collector.dataValues;
        res.status(200).json(_collector);
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changeData = async (req, res, next) => {
    const {full_name, email, address, oldPassword, newPassword} = req.body;

    try {
        const collector = await Collector.findByPk(req.collectorId);
        if (!collector) {
            const error = new Error('Không tìm thấy người dùng!');
            error.statusCode = 404;
            throw error;
        }
        if (full_name) {
            collector.full_name = full_name;
        }
        if (email) {
            collector.email = email;
        }
        if (address) {
            collector.address = address;
        }
        if (oldPassword) {
            const isEqual = await bcrypt.compare(oldPassword, collector.password);
            if (!isEqual) {
                const error = new Error('Mật khẩu cũ không đúng!');
                error.statusCode = 403;
                throw error;
            }
            if (newPassword && newPassword.length > 7) {
                const hashedPassword = await bcrypt.hash(newPassword, 12);
                collector.password = hashedPassword;
            } else {
                const error = new Error('Mật khẩu mới phải chứa ít nhất 8 kí tự');
                error.statusCode = 403;
                throw error;
            }
        }

        collector.updatedAt = new Date();

        await collector.save();
        res.status(200).json({
            message: 'Đã thay đổi thông tin thành công!'
        });

    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refreshToken'];
        await Token.destroy({ where: {token: refreshToken} });

        res.cookie('refreshToken', '', {maxAge: 0});

        res.status(200).json({
            message: 'success'
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refreshToken'];

        console.log(refreshToken);

        if (!refreshToken) {
            const error = new Error('Unauthenticated');
            error.statusCode = 401;
            throw error;
        }

        const payload = verify(refreshToken, process.env.JWT_REFRESH_KEY);

        if (!payload) {
            const error = new Error('Unauthenticated');
            error.statusCode = 401;
            throw error;
        }

        const dbToken = await Token.findOne( { where:{
            collectorId: payload.collectorId,
            expired_time: {
                [Op.gte]: new Date()
            }
        } });

        if (!dbToken) {
            const error = new Error('Unauthenticated');
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwt.sign({
                collectorId: payload.collectorId
            }, process.env.JWT_SECRET_KEY, {expiresIn: '1d'}
        );

        res.status(200).json({
            token: accessToken
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

