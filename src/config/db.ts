import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.r73p06e.mongodb.net/zlanca_social_network`)
        console.log("MongoDB Connected")
    }
    catch (err) {
        console.error('DB Connexion error : ', err)
    }
}