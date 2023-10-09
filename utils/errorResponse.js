class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message); //callback constructor
        this.statusCode = statusCode; //custom props
    } 
};   
module.exports = ErrorResponse;      


