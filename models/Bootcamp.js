const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required'],
        unique: true,
        trim: true,// remove whitespaces
        maxlength: [50, 'Name can not be more than 50 chars'],
    },
    slug: String,    //it will make all the alphabets in lower letter with hypen ;e.g, sami-khan
    description: {
        type: String,
        required: [true, 'Description is Required'],
        maxlength: [500, 'Description can not be more than 50 chars'],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Plz Use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        required: [20, 'Phone Number can not be longer than 20 chars'],
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Plz add Valid Email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Address is Required']
    },
    location: {
        // GeoJSON location
        type: {
            type: String,
            enum: ['Point'],
            //required: true,
        },
        coordinates: {
            type: [Number],
            //required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Others',
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be atleast 1'],
        max: [10, 'Rating can not be more than 10'],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    accepptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});
// Create Bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
});

// sami_Khan@321

//Geocode & Create location field
BootcampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    console.log('here ius ===', loc)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],

        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    //don't save address in db
    this.address = undefined;
    next();
})


module.exports = mongoose.model('Bootcamp', BootcampSchema);