import {SPECIAL_CHARS} from "../variables/char";

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