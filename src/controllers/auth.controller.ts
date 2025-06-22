import {Request, Response} from 'express'
import {UserModel} from "../models/user.model";

/* Register */
export const signUp = async (req: Request, res: Response) => {
    const { pseudo, email, password } = req.body

    try {
        const user = await UserModel.create({pseudo, email, password})
        res.status(201).json({userId: user._id})
    }
    catch (err) {
        res.status(400).json(err)
    }
}

/* Login */
export const signIn = async (req: Request, res: Response) => {}

/*  */
export const logout = async (req: Request, res: Response) => {}