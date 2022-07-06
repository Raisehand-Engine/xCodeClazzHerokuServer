const _ = require('lodash');
const mongoose = require('mongoose');

const { collection_xcodeclazz_request_callback, collection_xcodeclazz_course } = require('./_Constants');
const xCodeClazzRequestCallbackSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection_xcodeclazz_course,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    school: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    isReviewed: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true });

const xCodeClazzRequestCallback = mongoose.model(collection_xcodeclazz_request_callback, xCodeClazzRequestCallbackSchema);
module.exports = { xCodeClazzRequestCallback, xCodeClazzRequestCallbackSchema };
