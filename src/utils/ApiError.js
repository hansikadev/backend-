class ApiError extends Error{
    constructor(
        statusCode,
        message ="something went wrong",
        errors=[],
        statck=""

    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors

        if(statck){
            this.stack=statck
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}

// Normally, when something goes wrong in JavaScript, you use the built-in Error class to create an error.
// This ApiError extends (class ApiError extends Error) that built-in Error so you can:
// 1) Add extra information about the error (like statusCode, errors[]).
// 2) Use it specifically for API responses, so you can send a nice JSON error to the client instead of a messy default.