import {Request, Response} from "express"
import {UserModel} from "../models/user.model";

/* GetAll */
export const getAllUsers = async (_: Request, res: Response) => {
    try{
        const allUsers = await UserModel.find().select("-password")
        res.status(200).json(allUsers)
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

/* GetById */
export const getUserById = async (req: Request, res: Response) => {

    try{
        const user = await UserModel
            .findById(req.params.id)
            .select("-password")

        res.status(200).json(user)
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

/* UpdateById */
export const updateUserById = async (req: Request, res: Response) => {

    try{
        const user   = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        )

        res.status(200).json(user)
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

/* DeleteById */
export const deleteUserById = async (req: Request, res: Response) => {

    try{
        const user   = await UserModel.findByIdAndDelete(req.params.id)

        res.status(200).json(user)
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

/* Follow user */
export const followUser = async (req: Request, res: Response) => {

    try{
        /* Ajout du user que je suis */
        const userQuiFollow   = await UserModel.findByIdAndUpdate(
            /* id = id du user qui souhaite s'abonner à un autre user */
            req.params.id,
            {
                /* idToFollow = id du user qu'on veut suivre */
                $addToSet: { following: req.body.idToFollow }
            },
            { new: true }
        )

        /* Ajout du user qui me suis */
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {
                $addToSet: { followers: req.params.id }
            },
            { new: true }
        )
        res.status(200).json({userQuiFollow})
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

/* Unfollow user */
export const unfollowUser = async (req: Request, res: Response) => {

    try{
        /* Retrait du user dont je me désabonne */
        const userQuiUnfollow   = await UserModel.findByIdAndUpdate(
            /* id = id du user qui souhaite se désabonner d'un autre user */
            req.params.id,
            {
                /* idToUnfollow = id du user qu'on veut suivre */
                $pull: { following: req.body.idToUnfollow }
            },
            { new: true }
        )

        /* Ajout du user qui se désabonne de moi */
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {
                $pull: { followers: req.params.id }
            },
            { new: true }
        )
        res.status(200).json({userQuiUnfollow})
    }
    catch(err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}

