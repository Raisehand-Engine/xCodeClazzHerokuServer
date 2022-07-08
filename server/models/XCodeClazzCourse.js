const _ = require('lodash');
const mongoose = require('mongoose');

const { collection_xcodeclazz_course } = require('./_Constants');
const { image_containers } = require('../classes/RaisehandCloudinaryImageService');

const xCodeClazzCourseSchema = mongoose.Schema({
    title: {
        unique: 1,
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    subtitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    duration: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    thumbnailUrl: {
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
    features: {
        type: [String],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A course should have atleast one feature or bullet point',
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    hasActive: {
        type: Boolean,
        default: true,
        required: true
    },
    spaceLeft: {
        type: Number,
        required: true,
        min: 0,
        default: 128,
    },
    spaceFull: {
        type: Number,
        required: true,
        min: 0,
        default: 128,
    },
    session: {
        starts: {
            type: String,
            required: true,
            min: 0
        },
        ends: {
            type: String,
            required: true,
            min: 0
        },
    },
    keywords: {
        type: [String],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A course should have atleast one keyword',
        },
    }
}, { timestamps: true });

const xCodeClazzCourse = mongoose.model(collection_xcodeclazz_course, xCodeClazzCourseSchema);
module.exports = { xCodeClazzCourse, xCodeClazzCourseSchema };
