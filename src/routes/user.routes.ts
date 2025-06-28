import {Router} from "express";
import * as authController from "../controllers/auth.controller"
import * as userController from "../controllers/user.controller"
import * as uploadController from "../controllers/upload.controller"
import multer, {Multer, StorageEngine} from "multer";

const userRoutes: Router = Router()

const storage: StorageEngine = multer.memoryStorage()
const upload: Multer = multer({storage})

/* Auth */
userRoutes.post('/register', authController.signUp)
userRoutes.post('/login', authController.signIn)
userRoutes.get('/logout', authController.logout)

/* User DB */
userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)
userRoutes.put('/:id', userController.updateUserById)
userRoutes.delete('/:id', userController.deleteUserById)

/**
 * Follow et unfollow : id correspond à l'id du user
 * qui veut suivre un autre user
 */
userRoutes.patch('/follow/:id', userController.followUser)
userRoutes.patch('/unfollow/:id', userController.unfollowUser)

/* Upload */
userRoutes.post('/upload', upload.single('file'), uploadController.uploadProfil)

export default userRoutes