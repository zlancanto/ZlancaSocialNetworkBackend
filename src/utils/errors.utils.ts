import {SPECIAL_CHARS} from "../variables/char.variable";

    export const signUpErrors = (err: any) => {
    const errors = {
        pseudo: '',
        email: '',
        password: {},
        other: ''
    }

    console.error('err', err)

    // Validator
    if (err.message.toLowerCase().includes('pseudo')) {
        errors.pseudo = 'Pseudo incorrect (3 caractères minimum)'
    }
    else if (err.message.toLowerCase().includes('email')) {
        errors.email = 'Email incorrect'
    }
    else if (err.message.toLowerCase().includes('password')) {
        /*
        errors.password = `Le password incorrect :
        - 12 caractères minimum
        - Au moins une lettre majuscule
        - Au moins une lettre minuscule
        - Au moins un caractère spécial (${SPECIAL_CHARS})`
        */
        errors.password = {
            libelle: 'Le mot de passe doit contenir :',
            minChar: '12 caractères minimum',
            majLetter: 'Au moins une lettre majuscule',
            minLetter: 'Au moins une lettre minuscule',
            specialChar: `Au moins un caractère spécial (${SPECIAL_CHARS})`
        };
    }
    else {
        errors.other = err.message
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
        other: ''
    }

    console.error('err', err)

    if (err.message.toLowerCase().includes('email')) {
        errors.email = 'Email inconnu'
    }
    else if (err.message.toLowerCase().includes('password')) {
        errors.email = 'Mot de passe incorrect'
    }
    else {
        errors.other = err.message
    }

    return errors
}

export const uploadErrors = (err: any) => {
    const errors = {
        notFile: '',
        invalidFile: '',
        maxSizeFile: '',
        user: '',
        other: ''
    }

    if (err.message.toLowerCase().includes('Aucun fichier fourni')) {
        errors.notFile = err.message
    }
    else if (err.message.toLowerCase().includes('Format de fichier non valide')) {
        errors.invalidFile = err.message
    }
    else if (err.message.toLowerCase().includes('size')) {
        errors.maxSizeFile = err.message
    }
    else if (err.message.toLowerCase().includes("L'utilisateur du poster n'existe pas")) {
        errors.user = err.message
    }
    else if (err.message.toLowerCase().includes('Taille max acceptée')) {
        errors.user = err.message
    }
    else {
        errors.other = err.message
    }

    return errors
}