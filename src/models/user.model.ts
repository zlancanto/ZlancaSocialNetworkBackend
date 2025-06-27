import mongoose, {Model, Types} from "mongoose"
import {isEmail} from "validator"
import {REGEX_PASSWORD} from "../variables/regex";
import {SPECIAL_CHARS} from "../variables/char";
import bcrypt from "bcrypt"

/* Interface */
export interface IUser extends Document {
    _id: Types.ObjectId
    pseudo: string
    email: string
    password: string
    picture?: string
    bio?: string
    followers: Array<string>
    following: Array<string>
    likes: Array<string>
    createdAt: Date
    updatedAt: Date
}

/* Typage du model pour les meth static de userSchema */
export interface IUserModel extends Model<IUser> {
    login(email: string, password: string): Promise<IUser>
}

/* Schema */
const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024,
            minlength: 12,
            trim: true,
            validate: {
                validator: (value: string) => {
                    return REGEX_PASSWORD.test(value)
                },
                message: `Le mot de passe doit contenir au moins 12 caractères,
             dont une majuscule, une minuscule, un chiffre et un caractère spécial ${SPECIAL_CHARS}.`,
            }
        },
        picture: {
            type: String,
            default: '/public/randomUser.jpg'
        },
        bio: {
            type: String,
            maxlength: 1024,
        },
        followers: {
            type: [String],
        },
        following: {
            type: [String],
        },
        /* Les id des posts auxquels le user a liké */
        likes: {
            type: [String],
        }
    },
    {
        timestamps: true
    }
)

/* Play function before save into display: 'block' */
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

/* Login */
userSchema.statics.login = async function (email: string, password: string): Promise<IUser> {
    const user: IUser = await this.findOne({ email })
    if (!user) {
        throw new Error('Incorrect email')
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Incorrect password')
    }

    return user
}

export const UserModel: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema)