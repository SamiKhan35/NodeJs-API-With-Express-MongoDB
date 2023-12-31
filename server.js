const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


//load env vars
dotenv.config({ path: './config/config.env' })

//connect to DB
connectDB();


//routes require
const bootcamps = require('./routes/bootcamps');







const app = express();

//body parser
app.use(express.json());
//Dev Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// to use the above created middleware
app.use(logger);
app.use(errorHandler);






//midlewares 
app.use('/api/v1/bootcamps', bootcamps);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold)

)



//handle unhandled promise rejections :to terminate the application gracefully.
// process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error:${err.message}`.red);
//     //close server and exit process
//     server.close(() => { procss.exit(1) }); //
// })