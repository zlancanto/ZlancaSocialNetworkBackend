import {Types} from "mongoose";

export interface ITimestamps {
    createdAt: Date
    updatedAt: Date
}

export interface IComment {
    _id: Types.ObjectId
    commenterId: string
    text: string
    timestamp: number
}