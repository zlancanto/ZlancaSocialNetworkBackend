import {Types} from "mongoose";
import {Request, Response} from "express";

export const entityIdFormatIsInValid = (req: Request, res: Response) => {
    if (req.params?.id && !Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'req.params.id non conforme au format MongoDB' })
        return true
    }

    // likerId
    if (req.body?.likerId && !Types.ObjectId.isValid(req.body.likerId)) {
        res.status(400).json({ message: 'req.body.likerId non conforme au format MongoDB' })
        return true
    }

    // commenterId
    if (req.body?.commenterId && !Types.ObjectId.isValid(req.body.commenterId)) {
        res.status(400).json({ message: 'req.body.commenterId non conforme au format MongoDB' })
        return true
    }

    // posterId
    if (req.body?.posterId && !Types.ObjectId.isValid(req.body.posterId)) {
        res.status(400).json({ message: 'req.body.posterId non conforme au format MongoDB' })
        return true
    }

    // userId
    if (req.body?.userId && !Types.ObjectId.isValid(req.body.userId)) {
        res.status(400).json({ message: 'req.body.userId non conforme au format MongoDB' })
        return true
    }

    return false
}