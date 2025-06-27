import {Router} from "express";
import * as postController from "../controllers/post.controller";

const postRoutes: Router = Router()

/* Classic */
postRoutes.get('/', postController.getAllPost)
postRoutes.post('/', postController.createPost)
postRoutes.put('/:id', postController.updatePost)
postRoutes.delete('/:id', postController.deletePost)

/* Likes */
postRoutes.patch('/likePost/:id', postController.likePost)
postRoutes.patch('/unlikePost/:id', postController.unlikePost)

/* Comments */
postRoutes.patch('/commentPost/:id', postController.commentPost)
postRoutes.patch('/editCommentPost/:id', postController.editCommentPost)
postRoutes.patch('/deleteCommentPost/:id', postController.deleteCommentPost)

export default postRoutes