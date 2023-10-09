const express = require('express');
const router = express.Router();

// import controllers 
const { getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp, getBootcampInRadius } = require("../controllers/bootcampsCont");

//get all bootcamps
router.route('/').get(getBootcamps);

//get  single bootcamps
router.route('/:id').get(getBootcamp);

// create a bootcamps
router.route('/').post(createBootcamp);

//update a bootcamps
router.route('/:id').put(updateBootcamp);

// delete a bootcamps
router.route('/:id').delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);



module.exports = router;