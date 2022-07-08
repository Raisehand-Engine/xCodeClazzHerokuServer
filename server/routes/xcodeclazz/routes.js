const _ = require('lodash');
const { check } = require('express-validator');
const { image_containers } = require('../../classes/RaisehandCloudinaryImageService');

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

const XCODECLAZZ_LOGIC = require('./logic');
const _func = new XCODECLAZZ_LOGIC();

// [Not Tested]
// ...
router.get(`/status/students`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getStudentsStatus(req, res);
    });

// [Not Tested]
// ...
router.get(`/status/courses`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getCoursesStatus(req, res);
    });

// [Not Tested]
// ...
router.get(`/status/request_callbacks`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getRequestCallbacksStatus(req, res);
    });

// [Not Tested]
// ...
router.get(`/students`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getAllStudents(req, res);
    });

// [Not Tested]
// ...
router.post(`/student`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('studentId').isMongoId()
    ], validateRequestBody, async (req, res) => {
        await _func.getStudent(req, res);
    });

// [Not Tested]
// ...
router.post(`/student/create`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('name').isString(),
        check('imageUrl').isString().optional(),
        check('school').isString(),
        check('imageContainer').isString().custom(v => _.includes(_.values(image_containers), v)),
        check('age').isNumeric(),
        check('clazz').isString(),
        check('courseId').isMongoId(),
        check('timeSlot').exists().custom((v) => _.every(['from', 'to', 'weeks'], _.partial(_.has, v))),
        check('phoneNumbers').isString(),
        check('fees').exists().custom((v) => _.every(['amount', 'per'], _.partial(_.has, v))),
        check('batchNumber').isNumeric(),
        check('email').isEmail().optional()
    ], validateRequestBody, async (req, res) => {
        await _func.createStudent(req, res);
    });

// [Not Tested]
// ...
router.post(`/student/delete`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('studentId').isMongoId(),
    ], validateRequestBody, async (req, res) => {
        await _func.deleteStudent(req, res);
    });

// [Not Tested]
// ...
router.post(`/student/update`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('studentId').isMongoId(),

        check('name').isString().optional(),
        check('age').isNumeric().optional(),
        check('email').isEmail().optional(),
        check('clazz').isString().optional(),
        check('courseId').isMongoId().optional(),
        check('school').isString().optional(),
        check('phoneNumbers').isString().optional(),
        check('fees').exists().custom((v) => _.every(['amount', 'per'], _.partial(_.has, v))).optional(),
        check('timeSlot').exists().custom((v) => _.every(['from', 'to', 'weeks'], _.partial(_.has, v))).optional(),
    ], validateRequestBody, async (req, res) => {
        await _func.updateStudent(req, res);
    });

// [Not Tested]
// ...
router.get(`/request_callbacks`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getAllRequestCallbacks(req, res);
    });

// [Not Tested]
// ...
router.post(`/request_callback`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('requestCallbackId').isMongoId(),
    ], validateRequestBody, async (req, res) => {
        await _func.getRequestCallback(req, res);
    });

// [Not Tested]
// ...
router.post(`/request_callback/create`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('courseId').isMongoId(),
        check('name').isString(),
        check('phone').isString(),
        check('school').isString(),
    ], validateRequestBody, async (req, res) => {
        await _func.createRequestCallback(req, res);
    });

// [Not Tested]
// ...
router.post(`/request_callback/delete`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('requestCallbackId').isMongoId(),
    ], validateRequestBody, async (req, res) => {
        await _func.deleteRequestCallback(req, res);
    });

// [Not Tested]
// ...
router.post(`/request_callback/delete/all`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.deleteAllRequestCallback(req, res);
    });

// [Not Tested]
// ...
router.get(`/courses`,
    formDataParser,
    corsCheck,
    xray,
    [

    ], validateRequestBody, async (req, res) => {
        await _func.getAllCourses(req, res);
    });

// [Not Tested]
// ...
router.post(`/course`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('courseId').isMongoId(),
    ], validateRequestBody, async (req, res) => {
        await _func.getCourse(req, res);
    });

// [Not Tested]
// ...
router.post('/course/create',
    formDataParser,
    corsCheck,
    xray,
    [
        check('title').isString(),
        check('subtitle').isString(),
        check('duration').isString(),
        check('thumbnailUrl').isString(),
        check('imageContainer').isString().custom(v => _.includes(_.values(image_containers), v)),
        check('features').isArray().custom((v) => v.length > 0).custom(everyElementShouldBeString),
        check('keywords').isArray().custom((v) => v.length > 0).custom(everyElementShouldBeString),
        check('price').isNumeric(),
        check('hasActive').isBoolean(),
        check('spaceLeft').isNumeric(),
        check('spaceFull').isNumeric(),
        check('session').exists().custom((v) => _.every(['starts', 'ends'], _.partial(_.has, v))).optional(),
    ], validateRequestBody, async (req, res) => {
        await _func.createCourse(req, res);
    });

// [Not Tested]
// ...
router.post(`/course/update`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('courseId').isMongoId(),

        check('title').isString().optional(),
        check('subtitle').isString().optional(),
        check('duration').isString().optional(),
        check('thumbnailUrl').isString().optional(),
        check('features').isArray().custom((v) => v.length > 0).custom(everyElementShouldBeString).optional(),
        check('keywords').isArray().custom((v) => v.length > 0).custom(everyElementShouldBeString).optional(),
        check('price').isNumeric().optional(),
        check('hasActive').isBoolean().optional(),
        check('spaceLeft').isNumeric().optional(),
        check('spaceFull').isNumeric().optional(),
        check('session').exists().custom((v) => _.every(['starts', 'ends'], _.partial(_.has, v))).optional().optional(),
    ], validateRequestBody, async (req, res) => {
        await _func.updateCourse(req, res);
    });

// [Not Tested]
// ...
router.post(`/course/delete`,
    formDataParser,
    corsCheck,
    xray,
    [
        check('courseId').isMongoId(),
    ], validateRequestBody, async (req, res) => {
        await _func.deleteCourse(req, res);
    });

module.exports = router;