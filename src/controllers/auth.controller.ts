import {Request, Response} from 'express'
import {IUser, UserModel} from "../models/user.model";
import {createToken} from "../utils/auth.utils";
import {MAX_AGE} from "../variables/auth.variable";
import {signInErrors, signUpErrors} from "../utils/errors.utils";

/* Register */
export const signUp = async (req: Request, res: Response) => {
    const { pseudo, email, password } = req.body

    try {
        const user = await UserModel.create({pseudo, email, password})
        res.status(201).json({userId: user._id})
    }
    catch (err: any) {
        const errors = signUpErrors(err)
        res.status(400).json({errors})
    }
}

/* Login */
export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password)
        console.log(user)
        const token: string = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: MAX_AGE,
            secure: true,
            sameSite: 'strict'
        })
        res.status(200).json({userId: user._id})
    }
    catch (err: any) {
        console.error(err);
        const errors = signInErrors(err)
        res.status(401).json({ errors });
    }
}

/* Logout */
export const logout = async (_: Request, res: Response) => {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 })
    res.status(200).json({message: 'Logged out'})
}