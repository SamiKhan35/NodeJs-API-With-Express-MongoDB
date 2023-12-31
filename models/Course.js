const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: [true, 'course Title is Required']
    },
    description: {
        type: String,
        required: [true, 'desc is required']
    },
    weeks: {
        type: String,
        required: [true, 'Plz add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'plz add a tuition required']
    },
    minimumSkill: {
        type: String,
        required: [true, 'plz add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }

});
module.exports = mongoose.model('Course', CourseSchema);