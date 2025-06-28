import {Types} from "mongoose";
import jwt from "jsonwebtoken";
import {MAX_AGE} from "../variables/auth.variable";

export const createToken = (userId: Types.ObjectId): string => {

    if (!process.env.TOKEN_SECRET) {
        throw new Error("Token secret is required")
    }

    return jwt.sign({id: userId}, process.env.TOKEN_SECRET, {
        expiresIn: MAX_AGE
    })
}