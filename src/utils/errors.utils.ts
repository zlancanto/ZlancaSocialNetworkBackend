import {SPECIAL_CHARS} from "../variables/char.variable";

export const signUpErrors = (err: any) => {
    const errors = {
        pseudo: '',
        email: '',
        password: '',
    }

    console.error('err', err)

    // Validator
    if (err.message.toLowerCase().includes('pseudo')) {
        errors.pseudo = 'Pseudo incorrect (3 caractères minimum)'
    }
    if (err.message.toLowerCase().includes('email')) {
        errors.email = 'Email incorrect'
    }
    if (err.message.toLowerCase().includes('password')) {
        errors.password = `Le password incorrect : 
        - 12 caractères minimum
        - Au moins une lettre majuscule
        - Au moins une lettre minuscule
        - Au moins un caractère spécial (${SPECIAL_CHARS})`
    }

    // Doublons
    if (err.code === 11000 && err.keyPattern.pseudo) {
        errors.pseudo = 'Pseudo déjà pris'
    }
    if (err.code === 11000 && err.keyPattern.email) {
        errors.email = 'Email déjà pris'
    }

    return errors
}

export const signInErrors = (err: any) => {
    const errors = {
        email: '',
        password: '',
    }

    console.error('err', err)

    if (err.message.toLowerCase().includes('email')) {
        errors.email = 'Email inconnu'
    }
    if (err.message.toLowerCase().includes('password')) {
        errors.email = 'Password incorrect'
    }

    return errors
}

export const uploadErrors = (err: any) => {
    const errors = {
        notFile: '',
        invalidFile: '',
        maxSizeFile: '',
        user: '',
    }

    if (err.message.toLowerCase().includes('aucun fichier fourni')) {
        errors.notFile = err.message
    }
    if (err.message.toLowerCase().includes('invalid file type')) {
        errors.invalidFile = err.message
    }
    if (err.message.toLowerCase().includes('size')) {
        errors.maxSizeFile = err.message
    }
    if (err.message.toLowerCase().includes('user does not exist')) {
        errors.user = err.message
    }
    if (err.message.toLowerCase().includes('taille max acceptée')) {
        errors.user = err.message
    }

    return errors
}