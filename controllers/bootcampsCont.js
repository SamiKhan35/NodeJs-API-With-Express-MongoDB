const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const { parse } = require('dotenv');

// @desc     Get all bootcamps
// @route   Get/api/v1/bootcamps
// @access  Public 

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // To make a copy of an object by using the spread operator
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(el => delete reqQuery[el]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr))
    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log('sortedBy is', sortBy);
        query = query.sort(sortBy);

    } else {
        // Default sorting by createdAt in descending order
        query = query.sort('-createdAt');
    }
    // //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Count total documents in the collection
    const total = await Bootcamp.countDocuments();
    // Adjust query to skip and limit based on pagination
    query = query.skip(startIndex).limit(limit);



    // Executing query
    const bootcamps = await query;
    // pagination result
    const pagination = {};
    // Provide pagination details in the response
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});





// @desc    Get Single bootcamp
// @route   Get/api/v1/bootcamps
// @access  Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    // Try to find a bootcamp in the database by its ID
    const bootcamp = await Bootcamp.findById(req.params.id);

    // If no bootcamp is found with the given ID
    if (!bootcamp) {
        // Send a response saying "Bootcamp not found" with a 404 status (Not Found)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)); //not formated id 
    }

    // If a bootcamp is found, send a success response with the bootcamp data
    res.status(200).json({
        success: true,
        message: `Display bootcamp ${req.params.id}`,
        data: bootcamp,
    });
});

// @desc    Post Create new bootcamp
// @route   Post/api/v1/bootcamps
// @access  Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    console.log('your data is', req.body);
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, message: "Create new bootcamps", data: bootcamp });

});

// @desc    Update  bootcamp
// @route   Put/api/v1/bootcamps
// @access  Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    }

    res.status(200).json({ success: true, message: `update bootcamps `, data: bootcamp });

}
);

// @desc    Delete bootcamp
// @route   Delete/api/v1/bootcamps
// @access  Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    }

    // If the bootcamp is successfully deleted
    res.status(200).json({ success: true, message: "Bootcamp deleted", data: bootcamp });

});

// @desc    Get bootcamps within a radius
// @route   Get/api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    //Get lat lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calc radius using radians 
    // divide distance by radius of earth
    // earth radius is 3,958.8 mi / 6,371 km
    const radius = distance / 3958;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }

    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });

});








