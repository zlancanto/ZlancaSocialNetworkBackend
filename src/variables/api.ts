import ImageKit from "imagekit";

// Endpoint racine de notre API ImageKit
export const API_IMAGE_KIT_URL_ENDPOINT = process.env.API_IMAGE_KIT_URL_ENDPOINT

// API Keys
export const API_IMAGE_KIT_PUBLIC_KEY = process.env.API_IMAGE_KIT_PUBLIC_KEY
export const API_IMAGE_KIT_PRIVATE_KEY = process.env.API_IMAGE_KIT_PRIVATE_KEY

// Nom du dossier racine contenant toutes les images
export const API_IMAGE_KIT_FOLDER = process.env.API_IMAGE_KIT_FOLDER

// Dossier de stockage des img de profil
export const API_IMAGE_KIT_FOLDER_PROFIL = `${API_IMAGE_KIT_FOLDER}/profil`
// Dossier de stockage des img de post
export const API_IMAGE_KIT_FOLDER_POST = `${API_IMAGE_KIT_FOLDER}/post`
/* Dossier contenant l'img de profil par défaut */
export const API_IMAGE_KIT_FOLDER_DEFAULT = `${API_IMAGE_KIT_FOLDER}/default`

// ImageKit Errors
export const FOLDER_EXISTS = 'FOLDER_EXISTS'

// Objet permettant de requêter l'api ImageKit
export const IMAGE_KIT = new ImageKit({
    publicKey : API_IMAGE_KIT_PUBLIC_KEY || '',
    privateKey : API_IMAGE_KIT_PRIVATE_KEY || '',
    urlEndpoint : `${API_IMAGE_KIT_URL_ENDPOINT}/`
});