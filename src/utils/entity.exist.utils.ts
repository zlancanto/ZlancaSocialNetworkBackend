import {Types} from "mongoose";
import {Request, Response} from "express";

export const entityIdFormatIsInValid = (req: Request, res: Response) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'req.params.id non conforme au format MongoDB' })
        return true
    }

    if (req.body.likerId && !Types.ObjectId.isValid(req.body.likerId)) {
        res.status(400).json({ message: 'req.body.likerId non conforme au format MongoDB' })
        return true
    }

    if (req.body.commenterId && !Types.ObjectId.isValid(req.body.commenterId)) {
        res.status(400).json({ message: 'req.body.commenterId non conforme au format MongoDB' })
        return true
    }

    return false
}