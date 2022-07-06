const _ = require('lodash');
const mongoose = require('mongoose');

const { collection_xcodeclazz_student, collection_xcodeclazz_course } = require('./_Constants');
const { image_containers } = require('../classes/RaisehandCloudinaryImageService');

const xCodeClazzStudentSchema = mongoose.Schema({
    school: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
    },
    imageContainer: {
        minlength: 1,
        type: String,
        required: true,
        default: image_containers.image_container_raisehand,
        enum: _.values(image_containers),
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        min: 10,
    },
    clazz: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true,
    },
    payments: [{
        title: {
            type: String,
            minlength: 1,
            maxlength: 255,
            required: true,
        },
        date: {
            type: String,
            minlength: 1,
            maxlength: 255,
            required: true,
        },
    }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: collection_xcodeclazz_course }],
    timeSlot: {
        from: {
            type: String,
            minlength: 1,
            maxlength: 255,
            required: true,
        },
        to: {
            type: String,
            minlength: 1,
            maxlength: 255,
            required: true,
        },
        weeks: {
            type: [String],
            minlength: 1,
            maxlength: 255,
            required: true,
        },
    },
    phoneNumbers: {
        type: [String],
        required: true,
        min: 0,
        default: 0,
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    fees: {
        amount: {
            type: Number,
            min: 0,
            required: true,
        },
        per: {
            type: String,
            required: true,
            trim: true,
            minlength: 0,
            maxlength: 255,
        }
    },
    batchNumber: {
        type: Number,
        required: true,
        min: 0,
    },
    email: {
        type: String,
        unique: 1,
        required: false,
    },
}, { timestamps: true });

const xCodeClazzStudent = mongoose.model(collection_xcodeclazz_student, xCodeClazzStudentSchema);
module.exports = { xCodeClazzStudent, xCodeClazzStudentSchema };
