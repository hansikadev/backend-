class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 //This creates a success property that is true if statusCode is less than 400, otherwise false.
    }
}
//This code defines a JavaScript class called ApiResponse that’s used to create consistent API responses for your backend.When your server sends a reply to the client (frontend or API caller), instead of sending a random JSON each time, you can use this class to make the structure always look the same.