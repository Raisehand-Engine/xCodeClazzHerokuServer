const _ = require('lodash');
const { check } = require('express-validator');

const {
    everyElementShouldBeMongoId,
    everyElementShouldBeString,
    everyElementShouldBeNumber,
    stringLengthShouldBeMoreThen,
    stringLengthShouldBeMoreThenZero,
} = require('../../helper/validatorHelper');

// middlewares
const validateRequestBody = require('../../middlewares/validateBody');
const formDataParser = require('../../middlewares/formDataParser');
const corsCheck = require('../../middlewares/corsChecker');
const xray = require('../../middlewares/routeXRay');

// connections
const { express } = require('../../connections/express');
const router = express.Router();

const COMPILER_LOGIC = require('./logic');
const _func = new COMPILER_LOGIC();

// [Not Tested]
// ...
router.post(`/java`, formDataParser,
    corsCheck,
    xray, [
        check('code').isString()
    ], validateRequestBody, async (req, res) => {
        await _func.java(req, res);
    });

// [Not Tested]
// ...
router.post(`/c`, formDataParser,
    corsCheck,
    xray, [
        check('code').isString()
    ], validateRequestBody, async (req, res) => {
        await _func.c(req, res);
    });

// [Not Tested]
// ...
router.post(`/cpp`, formDataParser,
    corsCheck,
    xray, [
        check('code').isString()
    ], validateRequestBody, async (req, res) => {
        await _func.cpp(req, res);
    });

// [Not Tested]
// ...
router.post(`/python`, formDataParser,
    corsCheck,
    xray, [
        check('code').isString()
    ], validateRequestBody, async (req, res) => {
        await _func.python(req, res);
    });

// [Not Tested]
// ...
router.post(`/node`, formDataParser,
    corsCheck,
    xray, [
        check('code').isString()
    ], validateRequestBody, async (req, res) => {
        await _func.node(req, res);
    });


module.exports = router;