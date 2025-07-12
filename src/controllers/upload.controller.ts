import {Request, Response} from 'express'
import {UserModel} from "../models/user.model";
import {uploadErrors} from "../utils/errors.utils";
import {FILE_MAX_SIZE} from "../variables/file.variable";
import {entityIdFormatIsInValid} from "../utils/entity.exist.utils";
import {API_IMAGE_KIT_FOLDER_PROFIL, API_IMAGE_KIT_URL_ENDPOINT, IMAGE_KIT} from "../variables/api";

export const uploadProfil = async (req: Request, res: Response) => {
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg']

    if (entityIdFormatIsInValid(req, res)) {
        return
    }

    try {
        // Aucun fichier
        if (!req.file || !req.file.buffer) {
            throw new Error('Aucun fichier fourni')
        }

        // Fichier invalid
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            throw new Error('Invalid file type')
        }

        // Max size
        if ((req.file.size) > FILE_MAX_SIZE) {
            throw new Error('Taille max acceptée : 5Mo')
        }

        // User connected
        let userConnected = await UserModel.findById(req.body.userId)
        if (!userConnected) {
            throw new Error('User does not exist')
        }

        // Image downloaded
        const imgName = `${userConnected.pseudo}.jpg`
        // Chemin à stocker dans la bd
        const imgRelativePath = `${API_IMAGE_KIT_FOLDER_PROFIL}/${imgName}`

        // Stock l'image dans le cloud
        let imageUrlInImageKit: string | undefined;
        IMAGE_KIT.upload({
            file: req.file.buffer,
            fileName: imgName,
            folder: API_IMAGE_KIT_FOLDER_PROFIL,
            useUniqueFileName: false,
            overwriteFile: true
        }, (error, result)=> {
            if (error) {
                throw error
            }
            imageUrlInImageKit = result?.url
            console.log(result)
        });

        console.log('DEBUG req.file:', req.file)
        console.log('DEBUG req.body:', req.body)

        userConnected = await UserModel.findByIdAndUpdate(
            userConnected._id,
            {
                $set: {
                    picture: `${API_IMAGE_KIT_URL_ENDPOINT}/${imgRelativePath}`,
                    //image: imageKitResponse
                }
            },
            {new: true},
        ).select('-password')

        res.status(200).json({message: 'Fichier uploadé avec succès', data: userConnected})
    } catch (error: any) {
        const errors = uploadErrors(error)
        console.error('Erreur lors de l’upload : ', error)
        console.error('Errors : ', errors)
        res.status(500).json({errors})
    }
}