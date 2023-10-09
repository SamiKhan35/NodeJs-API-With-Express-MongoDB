const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected Successfully ${con.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.log(`Error in Connecting with MongoDB ${error}`);
    }
};
    
module.exports = connectDB;
