const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course');

// @desc     Get Courses
// @route   Get/api/v1/courses
// @route   Get/api/v1/:bootcampId/courses
// @access  Public 
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    }
})







