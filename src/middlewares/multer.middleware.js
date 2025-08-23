import multer from "multer"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({
    storage: storage, 
})

/*

The multer.diskStorage() method tells Multer that you want to save the uploaded files directly to the server's hard drive. It requires two key pieces of information:

1) destination: This function tells Multer where to save the files.
cb(null, './public/temp'): The code specifies that all incoming files should be placed in a folder named temp inside the public directory.

2) filename: This function tells Multer what to name the files.
cb(null, file.originalname): This code instructs Multer to keep the original filename of the file as it was on the user's computer


export const upload = multer({
    storage: storage, 
})
This final piece creates the actual Multer middleware. It takes the storage instructions you just defined and packages them into a reusable object named upload.
You can now import this upload object into your routes and use it as a middleware to process file uploads for specific endpoints, like upload.single('avatar') or upload.fields([...]).

*/