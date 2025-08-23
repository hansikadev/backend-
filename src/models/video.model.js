import mongoose,{Schema} from "mongoose";
import mongooseAggeratePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema= new Schema(
    {
        videofile:{
            type:String, //cloudinary url
            required:true
        },
        thumbnail:{
            type:String, //cloudinary url
            required:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"user"
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true //This field indicates whether the video is published or not. If true, the video is publicly accessible; if false, it might be private or unlisted.
        }
    },
    {timestamps:true}
)

videoSchema.plugin(mongooseAggeratePaginate); //This line "installs" the pagination functionality onto your videoSchema. Now, your Video model will have a new method (e.g., aggregatePaginate) that it didn't have before, which you can use to easily query for paged results.



/*
Mongoose Plugins 🧩
A plugin in Mongoose is a reusable package of code that adds extra functionality to your data schemas
A Mongoose plugin is like an app you install on your smartphone. Your phone (the schema) has core features, but when you need a specific new capability, you install an app (the plugin).

Purpose:
=> Reusability: Instead of writing the same complex logic for multiple schemas, you can put it in a plugin and attach it to any schema you want.
=> Modularity: It keeps your schema file clean and focused on defining the data's shape. The extra functionality is neatly packaged away.
=> Community Features: You can easily add powerful features created by other developers, saving you a lot of time.



Pagination 📖
//Pagination is the process of dividing a large set of data into smaller, manageable pages.
Pagination is the familiar concept of breaking up a long list of items into pages, just like the pages in a book or the results on a Google search.

Purpose:
Imagine you have thousands of videos in your database. Without pagination, if a user asks for a list of videos, your server would have to:
1) Fetch all thousands of videos from the database.
2) Send that massive amount of data to the user's browser.

This is extremely slow, inefficient, and creates a terrible user experience.
Pagination solves this by allowing you to ask for a specific "page" of results. For example, "give me page 2 of the videos, with 10 videos per page." This way, the server only ever has to fetch and send a small, manageable chunk of data at a time.



The mongoose-aggregate-paginate-v2 plugin you've added is specifically designed to make pagination easy when performing complex database queries (aggregations). When you use its method, it will not only return the 10 videos for the requested page but also provide helpful information like:

=> Total number of videos
=> Total number of pages
=> The current page number
=> If there is a next page or a previous page

This information is essential for building the "Page 1, 2, 3..." navigation controls in your user interface.


*/