import {Request, Response} from 'express'
import {PostModel} from "../models/post.model";
import {entityIdFormatIsInValid} from "../utils/entity.exist.utils";
import {UserModel} from "../models/user.model";
import {MongooseError} from "mongoose";
import {throws} from "node:assert";
import {IComment} from "../utils/interface.utils";
import {FILE_MAX_SIZE} from "../variables/file.variable";
import path from "node:path";
import {mkdir, writeFile} from "node:fs/promises";
import {uploadErrors} from "../utils/errors.utils";

/* Get All */
export const getAllPost = async (_: Request, res: Response) => {
    try {
        /* On trie le liste du plus récent au moins recent */
        const postList = await PostModel.find().sort({createdAt: -1})
        res.status(200).json(postList)
    } catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Create */
export const createPost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    const {posterId, message, video} = req.body
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg']

    try {
        let imgRelativePath: string|undefined
        if (req.file && req.file.buffer) {

            // Fichier invalid
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid file type')
            }

            // Max size
            if ((req.file.size) > FILE_MAX_SIZE) {
                throw new Error('Taille max acceptée : 5Mo')
            }

            // Poster user
            let posterUser = await UserModel.findById(posterId).select('-password')
            if (!posterUser) {
                throw new Error('Poster user does not exist')
            }

            /* Image uploaded */

            // Nom du fichier
            const imgName: string = `${posterUser.pseudo}_${Date.now()}.jpg`
            // Chemin du dossier spécifique à l'utilisateur
            const userPostDir: string = path.join('uploads/post', posterUser.pseudo)
            // On crée le dossier (et ses parents) s'il n'existe pas
            await mkdir(userPostDir, { recursive: true })
            // Chemin complet de l'image dans ce dossier
            const imgPath = path.join(__dirname, `../client/public/${userPostDir}`, imgName)
            // Ecriture de l'img
            await writeFile(imgPath, req.file.buffer)
            // Chemin à stoker dans la bd
            imgRelativePath = path.join(`./${userPostDir}`, imgName)
        }

        const newPost = await PostModel.create({
            posterId,
            message,
            picture: imgRelativePath,
            video,
            likers: [],
            comments: [],
        })
        res.status(201).json(newPost)
    } catch (error: any) {
        const errors = uploadErrors(error)
        console.error('Erreur : ', error)
        console.error('Errors : ', errors)
        res.status(500).json({ errors })
    }
}

/* Update */
export const updatePost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    const {message, video} = req.body

    try {
        const postUpdated = await PostModel.findByIdAndUpdate(
            req.params.id,
            {message, video},
            {new: true}
        )

        if (!postUpdated) {
            res.status(404).json({message: "Post introuvable"})
        } else {
            res.status(200).json(postUpdated)
        }
    } catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Delete */
export const deletePost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    try {
        const postDeleted = await PostModel.findByIdAndDelete(req.params.id)

        if (!postDeleted) {
            res.status(404).json({message: "Post introuvable"})
        } else {
            res.status(200).json(postDeleted)
        }
    } catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Like */
export const likePost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    try {
        const postLiked = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.likerId }
            },
            {new: true}
        )

        if (!postLiked) {
            throw new MongooseError('Post introuvable')
        }

        const userUpdated = await UserModel.findByIdAndUpdate(
            req.body.likerId,
            {
                $addToSet: { likes: req.params.id }
            },
            {new: true}
        )

        if (!userUpdated) {
            res.status(404).json({message: 'User introuvable'})
        } else {
            res.status(200).json(userUpdated)
        }
    } catch (error) {
        console.error('error : ', error)
        res.json({error})
    }
}

/* Unlike */
export const unlikePost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    try {
        const postUnliked = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.likerId }
            },
            {new: true}
        )

        if (!postUnliked) {
            throw new MongooseError('Post introuvable')
        }

        const userUpdated = await UserModel.findByIdAndUpdate(
            req.body.likerId,
            {
                $pull: { likes: req.params.id }
            },
            {new: true}
        )

        if (!userUpdated) {
            res.status(404).json({message: 'User introuvable'})
        } else {
            res.status(200).json(userUpdated)
        }
    } catch (error) {
        console.error('error : ', error)
        res.json({error})
    }
}

/* Create comment */
export const commentPost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    const { commenterId, text } = req.body

    try {
        const postCommented = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: {
                    comments: {
                        commenterId,
                        text,
                        timestamp: Date.now(),
                    }
                }
            },
            {new: true}
        )

        if (!postCommented) {
            res.status(404).json({message: 'Post introuvable'})
        } else {
            res.status(200).json(postCommented)
        }
    }
    catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Edit comment */
export const editCommentPost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    const { commentId, text } = req.body

    try {
        /* Récupération du post */
        const postCommented = await PostModel.findById(req.params.id)
        if (!postCommented) {
            throw new MongooseError('Post introuvable')
        }

        /* Récupération du commentaire */
        const commentToUpdate = postCommented
            .comments
            .find((comment: IComment) => comment._id.equals(commentId))
        if (!commentToUpdate) {
            throw new MongooseError('Comment introuvable')
        }

        /* Modif et sauvegarde du post */
        commentToUpdate.text = text
        await postCommented.save()

        res.status(200).json(postCommented)
    }
    catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Delete comment */
export const deleteCommentPost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    try {
        const postCommented = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {_id : req.body.commentId}
                }
            },
            {new: true}
        )

        if (!postCommented) {
            throw new MongooseError('Post introuvable')
        }

        res.status(200).json(postCommented)
    }
    catch (err) {
        console.error('error : ', err)
        res.status(500).json({err})
    }
}