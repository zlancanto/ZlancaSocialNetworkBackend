import {NextFunction, Request, Response} from 'express'
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import {UserModel} from "../models/user.model";

/**
 * Exécuté à chaque requête utilisateur
 * Permet de vérifier si l'utilisateur est auth avec le bon token
 * @param req
 * @param res
 * @param next
 */
export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt

    if (!token) {
        res.locals.user = null
        return next()
    }

    if (!process.env.TOKEN_SECRET) {
        throw new Error('TOKEN_SECRET n’est pas défini dans .env')
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as JwtPayload

        const user = await UserModel.findById(decoded.id)
        res.locals.user = user || null
    } catch (err) {
        res.locals.user = null
        res.cookie('jwt', '', { maxAge: 0 })
    }

    return next()
}

/**
 * Vérifie le token lors de l'auth du user
 * @param req
 * @param res
 * @param next
 */
export const requireAuth = async (req: Request, _: Response, next: NextFunction) => {
    const token = req.cookies.jwt

    if (!token) {
        console.log('No token')
    }

    if (!process.env.TOKEN_SECRET) {
        throw new Error('TOKEN_SECRET n’est pas défini dans .env')
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET) as JwtPayload
        console.log('decodedToken.id : ', decodedToken.id)
        next()
    }
    catch (err) {
        console.error('error : ', err)
    }
}