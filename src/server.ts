import express, {Express} from 'express'
import {connectDB} from "./config/db";
import {config} from "dotenv";
import path from "node:path";
import userRoutes from "./routes/user.routes";

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

/* Routes */
app.use('/api/user', userRoutes)

/* Port écouté par le serveur */
app.listen(port, () => console.log(`Listening on port ${port}`))