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

videoSchema.plugin(mongooseAggeratePaginate);
 