import {Model, model, Schema} from "mongoose";
import {IComment, ITimestamps} from "../utils/interface.utils";

export interface IPost extends Document, ITimestamps {
    postId: string
    message: string
    picture: string
    video: string
    likers: Array<string>
    comments: Array<IComment>
}

export interface IPostModel extends Model<IPost> {
}

const postSchema = new Schema({
        posterId: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        picture: {
            type: String,
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true,
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    text: String,
                    timestamp: Number
                }
            ],
            required: true,
        },
    },
    {timestamps: true}
)

export const PostModel: IPostModel = model<IPost, IPostModel>("Post", postSchema)