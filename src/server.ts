import express, {Express, Request, Response} from 'express'
import {connectDB} from "./config/db";

import {config} from "dotenv";
/* Chargement de dotenv */
config()

import path from "node:path";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import {checkUser, requireAuth} from "./middleware/auth.middleware";
import postRoutes from "./routes/post.routes";
import cors from "cors"
import {CORS_OPTIONS} from "./variables/cors.variable";

/* Connexion à la DB */
connectDB()

const app: Express = express()

/* Autorise l'API aux utilisations externes */
app.use(cors(CORS_OPTIONS))

/* Sert les fichiers statiques dans /public */
app.use('/public', express.static(path.join(__dirname, '..', 'public')))

/* Middlewares */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/* JWT Middlewares */
app.use(checkUser)
app.get('/jwtId', requireAuth, (_: Request, res: Response) => {
    res.status(200).send(res.locals.user._id)
})

/* Routes */
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)

/* Port écouté par le serveur */
const port = process.env.PORT
app.listen(port, () => console.log(`Listening on port ${port}`))