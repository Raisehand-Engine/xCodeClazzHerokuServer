const _ = require('lodash');

const {
    notUNE,
    notUN
} = require('../../helper/validatorHelper');
const Utils = require('../../helper/utils');
const MailGun = require('../../classes/MailGun');
const RESPONSE = require('../../classes/RESPONSER');
const not = (o) => !o;

// Models
const { xCodeClazzRequestCallback } = require('../../models/XCodeClazzRequestCallback');
const { xCodeClazzStudent } = require('../../models/XCodeClazzStudent');
const { xCodeClazzCourse } = require('../../models/XCodeClazzCourse');

class XCODECLAZZ_LOGIC {

    async getStudentsStatus(req, res) { return new RESPONSE(res).ok({ message: 'please implement aggrigation pipeline' }); }
    async getCoursesStatus(req, res) { return new RESPONSE(res).ok({ message: 'please implement aggrigation pipeline' }); }
    async getRequestCallbacksStatus(req, res) { return new RESPONSE(res).ok({ message: 'please implement aggrigation pipeline' }); }

    async getAllStudents(req, res) {
        const students = await xCodeClazzStudent.find({}).populate('courses');
        return new RESPONSE(res).ok({ students });
    }
    async getStudent(req, res) {
        const student = await xCodeClazzStudent.findById(req.body?.studentId).populate('courses');
        return new RESPONSE(res).ok({ student });
    }
    async createStudent(req, res) {
        const {
            name, imageUrl, school, imageContainer, age, clazz, courseId, timeSlot, phoneNumbers, fees, batchNumber, email
        } = _.pick(req.body, ['name', 'imageUrl', 'school', 'imageContainer', 'age', 'clazz', 'courseId', 'timeSlot', 'phoneNumbers', 'fees', 'batchNumber', 'email']);

        const newStudent = await new xCodeClazzStudent({
            name, imageUrl, school, imageContainer, age, clazz, courseId, timeSlot, phoneNumbers, fees, batchNumber, email
        }).save();

        if (not(newStudent)) return new RESPONSE(res).bad(Utils.errBody("Something went wrong, try again"));
        return new RESPONSE(res).ok({ message: 'new student has been created', document: newStudent });
    }
    async updateStudent(req, res) { return new RESPONSE(res).ok({ message: 'please implement' }); }
    async deleteStudent(req, res) {
        const studentDeleted = await xCodeClazzStudent.deleteOne({ _id: req.body?.studentId });
        if (not(studentDeleted)) return new RESPONSE(res).bad(Utils.errBody('Unable to delete the student for some reason'));
        return new RESPONSE(res).ok({ message: `student with id: ${req.body?.studentId} has been deleted` });
    }

    async getAllRequestCallbacks(req, res) {
        const callbacks = await xCodeClazzRequestCallback.find({}).populate('course');
        return new RESPONSE(res).ok({ callbacks });
    }
    async getRequestCallback(req, res) {
        const callback = await xCodeClazzRequestCallback.findById(req.body?.requestCallbackId).populate('course');
        return new RESPONSE(res).ok({ callback });
    }
    async createRequestCallback(req, res) {
        const { courseId: course, name, phone, school } = _.pick(req.body, ['courseId', 'name', 'phone', 'school']);

        const doc = await new xCodeClazzRequestCallback({ course, name, phone, school }).save();
        if (not(doc)) return new RESPONSE(res).bad(Utils.errBody("Something went wrong, try again"));

        const mg = new MailGun();
        const userDetailsAsHtml = require('../../classes/HtmlTamplateGenerator').table(doc);
        mg.sendPlainMail(['gouravgupta920@gmail.com'], `New request callback update ♥`, `${userDetailsAsHtml}`, (error, response) => {
            if (error) return new RESPONSE(res).ok({ message: 'Email not sent while reqest for callback has generated', error, document: doc });
            return new RESPONSE(res).ok({ message: 'Request Callback has created, Thanks', document: doc });
        });
    }
    async deleteRequestCallback(req, res) {
        const callbackDeleted = await xCodeClazzRequestCallback.deleteOne({ _id: req.body?.requestCallbackId });
        if (not(callbackDeleted)) return new RESPONSE(res).bad(Utils.errBody('Unable to delete the request callback for some reason'));
        return new RESPONSE(res).ok({ message: `request callback with id: ${req.body?.requestCallbackId} has been deleted` });
    }
    async deleteAllRequestCallback(req, res) {
        const callbackDeleted = await xCodeClazzRequestCallback.deleteMany({});
        if (not(callbackDeleted)) return new RESPONSE(res).bad(Utils.errBody('Unable to delete all callback requests'));
        return new RESPONSE(res).ok({ message: `All callback request has been deleted successfully` });
    }

    async getAllCourses(req, res) {
        const courses = await xCodeClazzCourse.find({});
        return new RESPONSE(res).ok({ courses });
    }
    async getCourse(req, res) {
        const course = await xCodeClazzCourse.findById(req.body?.courseId);
        return new RESPONSE(res).ok({ course });
    }
    async createCourse(req, res) {
        const {
            title, subtitle, duration, thumbnailUrl, imageContainer, features, price, hasActive, spaceLeft, spaceFull, session
        } = _.pick(req.body, ['title', 'subtitle', 'duration', 'thumbnailUrl', 'imageContainer', 'features', 'price', 'hasActive', 'spaceLeft', 'spaceFull', 'session']);

        const newCourse = await new xCodeClazzCourse({
            title, subtitle, duration, thumbnailUrl, imageContainer, features, price, hasActive, spaceLeft, spaceFull, session
        }).save();

        if (not(newCourse)) return new RESPONSE(res).bad(Utils.errBody("Something went wrong, try again"));
        return new RESPONSE(res).ok({ message: 'new course has been created', document: newCourse });
    }
    async updateCourse(req, res) {
        const {
            courseId, title, subtitle, duration, thumbnailUrl, features, price, hasActive, spaceLeft, spaceFull, session
        } = _.pick(req.body, ['courseId', 'title', 'subtitle', 'duration', 'thumbnailUrl', 'features', 'price', 'hasActive', 'spaceLeft', 'spaceFull', 'session']);

        const doc = await xCodeClazzCourse.findById(courseId);
        if (not(doc)) return new RESPONSE(res).bad(Utils.errBody("Course can not update. cant find the course"));
        
        await notUN('xCodeCourse.hasActive', doc.hasActive, res);
        if (res.headersSent) return;

        if (not(_.isUndefined(title))) doc.title = title;
        if (not(_.isUndefined(subtitle))) doc.subtitle = subtitle;
        if (not(_.isUndefined(duration))) doc.duration = duration;
        if (not(_.isUndefined(thumbnailUrl))) doc.thumbnailUrl = thumbnailUrl;
        if (not(_.isUndefined(features))) doc.features = features;
        if (not(_.isUndefined(price))) doc.price = price;
        if (not(_.isUndefined(hasActive))) doc.hasActive = hasActive;
        if (not(_.isUndefined(spaceLeft))) doc.spaceLeft = spaceLeft;
        if (not(_.isUndefined(spaceFull))) doc.spaceFull = spaceFull;
        if (not(_.isUndefined(session))) doc.session = session;

        await doc.save();
        if (not(doc)) return new RESPONSE(res).bad(Utils.errBody('Something went wrong while updating xcodecourse'));

        return new RESPONSE(res).ok({ message: 'xCodeCourse has been updated', document: doc });
    }
    async deleteCourse(req, res) {
        const courseDeleted = await xCodeClazzCourse.deleteOne({ _id: req.body?.courseId });
        if (not(courseDeleted)) return new RESPONSE(res).bad(Utils.errBody('Unable to delete the course for some reason'));
        return new RESPONSE(res).ok({ message: `course with id: ${req.body?.courseId} has been deleted` });
    }

}

module.exports = XCODECLAZZ_LOGIC;