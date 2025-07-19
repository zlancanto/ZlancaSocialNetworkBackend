import {Request, Response} from 'express'
import {PostModel} from "../models/post.model";
import {entityIdFormatIsInValid} from "../utils/entity.exist.utils";
import {UserModel} from "../models/user.model";
import {MongooseError} from "mongoose";
import {IComment} from "../utils/interface.utils";
import {FILE_MAX_SIZE} from "../variables/file.variable";
import {uploadErrors} from "../utils/errors.utils";
import {API_IMAGE_KIT_FOLDER_POST, API_IMAGE_KIT_URL_ENDPOINT, IMAGE_KIT} from "../variables/api";

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
        let imgAbsolutePath: string | undefined;
        if (req.file && req.file.buffer) {

            // Fichier invalid
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Format de fichier non valide')
            }

            // Max size
            if ((req.file.size) > FILE_MAX_SIZE) {
                throw new Error('Taille max acceptée : 5Mo')
            }

            // Poster user
            let posterUser = await UserModel.findById(posterId).select('-password')
            if (!posterUser) {
                throw new Error("L'utilisateur du poster n'existe pas")
            }

            /* Image uploaded */

            // Creation du dossier spécifique aux post du user
            await IMAGE_KIT.createFolder({
                folderName: posterUser.pseudo,
                parentFolderPath: `${API_IMAGE_KIT_FOLDER_POST}/`
            });

            // Nom du fichier
            const imgName: string = `${posterUser.pseudo}_${Date.now()}.jpg`;
            imgAbsolutePath = `${API_IMAGE_KIT_URL_ENDPOINT}/${API_IMAGE_KIT_FOLDER_POST}/${posterUser.pseudo}/${imgName}`;

            await IMAGE_KIT.upload({
                file: req.file.buffer,
                fileName: imgName,
                folder: `${API_IMAGE_KIT_FOLDER_POST}/${posterUser.pseudo}/`,
                useUniqueFileName: false,
                overwriteFile: true,
            });
        }

        const newPost = await PostModel.create({
            posterId,
            message,
            picture: imgAbsolutePath,
            video,
            likers: [],
            comments: [],
        })
        res.status(201).json(newPost)
    } catch (error: any) {
        const errors = uploadErrors(error)
        console.error('UploadErreur : ', error)
        console.error('UploadErrors : ', errors)
        res.status(500).json({errors})
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
                $addToSet: {likers: req.body.likerId}
            },
            {new: true}
        )

        if (!postLiked) {
            throw new MongooseError('Post introuvable')
        }

        const userUpdated = await UserModel.findByIdAndUpdate(
            req.body.likerId,
            {
                $addToSet: {likes: req.params.id}
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
                $pull: {likers: req.body.unlikerId}
            },
            {new: true}
        )

        if (!postUnliked) {
            throw new MongooseError('Post introuvable')
        }

        const userUpdated = await UserModel.findByIdAndUpdate(
            req.body.unlikerId,
            {
                $pull: {likes: req.params.id}
            },
            {new: true}
        )

        if (!userUpdated) {
            res.status(404).json({message: 'Utilisateur introuvable'})
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

    const {commenterId, text} = req.body

    try {
        const postCommented = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        $each: [
                            {
                                commenterId,
                                text,
                                timestamp: Date.now(),
                            }
                        ],
                        $position: 0
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
    } catch (error) {
        console.error('error : ', error)
        res.status(500).json({error})
    }
}

/* Edit comment */
export const editCommentPost = async (req: Request, res: Response) => {
    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    const {commentId, text} = req.body

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
            throw new MongooseError('Commentaire introuvable')
        }

        /* Modif et sauvegarde du post */
        commentToUpdate.text = text
        await postCommented.save()

        res.status(200).json(postCommented)
    } catch (error) {
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
                    comments: {_id: req.body.commentId}
                }
            },
            {new: true}
        )

        if (!postCommented) {
            throw new MongooseError('Post introuvable')
        }

        res.status(200).json(postCommented)
    } catch (err) {
        console.error('error : ', err)
        res.status(500).json({err})
    }
}