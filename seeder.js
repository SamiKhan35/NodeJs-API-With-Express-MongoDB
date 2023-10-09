const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


//load env file
dotenv.config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
//connect to DB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
});

//Reading  JSON File/data
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

//import into db 
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('data imported ... '.green.inverse);
        process.exit();
    }
    catch (error) {
        console.log(error);
    }
}

//delete the data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();

        console.log('destroyed data...'.red.inverse);
        process.exit();// This exits the process with the default exit code of 0.

    }
    catch (err) {
        console.log(err);
    }
}
if (process.argv[2] == '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}


