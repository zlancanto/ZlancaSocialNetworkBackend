import express, {Express, Request, Response} from 'express'
import {connectDB} from "./config/db";
import {config} from "dotenv";
import path from "node:path";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import {checkUser, requireAuth} from "./middleware/auth.middleware";

/* Port */
const port = process.env.PORT || 9000

/* Chargement de dotenv */
config()

/* Connexion à la DB */
connectDB()

const app: Express = express()

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

/* Port écouté par le serveur */
app.listen(port, () => console.log(`Listening on port ${port}`))